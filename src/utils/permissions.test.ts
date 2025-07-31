import { hasPermission } from "./permissions";

describe("hasPermission util", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns true if the permission exists in localStorage", () => {
    localStorage.setItem(
      "permissions",
      JSON.stringify(["MANAGE_PRODUCTS", "MANAGE_CHECKOUTS"])
    );
    expect(hasPermission("MANAGE_PRODUCTS")).toBe(true);
    expect(hasPermission("MANAGE_CHECKOUTS")).toBe(true);
  });

  it("returns false if the permission does not exist", () => {
    localStorage.setItem("permissions", JSON.stringify(["MANAGE_PRODUCTS"]));
    expect(hasPermission("MANAGE_CHECKOUTS")).toBe(false);
  });

  it("returns false if permissions are empty", () => {
    localStorage.setItem("permissions", JSON.stringify([]));
    expect(hasPermission("MANAGE_PRODUCTS")).toBe(false);
  });

  it("returns false if permissions key is missing from localStorage", () => {
    localStorage.removeItem("permissions");
    expect(hasPermission("MANAGE_PRODUCTS")).toBe(false);
  });

  it("handles invalid JSON gracefully", () => {
    localStorage.setItem("permissions", "invalid-json");
    expect(() => hasPermission("MANAGE_PRODUCTS")).toThrow();
  });
});
