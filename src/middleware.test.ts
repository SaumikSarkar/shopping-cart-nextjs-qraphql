/**
 * @jest-environment node
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { middleware } from "../src/middleware";

// Spy on NextResponse methods
jest.spyOn(NextResponse, "redirect");
jest.spyOn(NextResponse, "next");

// Helper to create a mock NextRequest
function createMockRequest(
  pathname: string,
  cookies: Record<string, string> = {}
): NextRequest {
  const url = new URL(`http://localhost${pathname}`);

  return {
    nextUrl: {
      pathname: url.pathname,
      clone: () => new URL(url.toString()),
    },
    cookies: {
      get: (key: string) =>
        cookies[key] ? { value: cookies[key] } : undefined,
    },
  } as unknown as NextRequest;
}

describe("middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("allows access to public paths", () => {
    const req = createMockRequest("/login");
    middleware(req);
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it("redirects to /login if not authenticated on protected path", () => {
    const req = createMockRequest("/products");
    middleware(req);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ href: "http://localhost/login" })
    );
  });

  it("redirects to /unauthorized if missing required permission", () => {
    const req = createMockRequest("/products", {
      token: "valid-token",
      permissions: JSON.stringify(["MANAGE_CHECKOUTS"]),
    });
    middleware(req);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ href: "http://localhost/unauthorized" })
    );
  });

  it("allows access if correct permission present", () => {
    const req = createMockRequest("/products", {
      token: "valid-token",
      permissions: JSON.stringify(["MANAGE_PRODUCTS"]),
    });
    middleware(req);
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it("redirects to /login if permissions JSON is invalid", () => {
    const req = createMockRequest("/checkout", {
      token: "valid-token",
      permissions: "INVALID_JSON",
    });
    middleware(req);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ href: "http://localhost/login" })
    );
  });
});
