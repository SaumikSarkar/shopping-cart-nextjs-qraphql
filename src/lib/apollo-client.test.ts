import type { ApolloClient } from "@apollo/client";

type ContextFn = (
  _operation: Record<string, unknown>,
  prevContext: { headers: Record<string, string> }
) => { headers: Record<string, string> };

describe("apollo-client", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    localStorage.clear();

    jest.doMock("@apollo/client/link/context", () => ({
      setContext: jest.fn((fn: ContextFn) => ({
        concat: jest.fn(),
        __fn: fn,
      })),
    }));

    jest.doMock("@apollo/client", () => {
      return {
        createHttpLink: jest.fn(() => "mockHttpLink"),
        InMemoryCache: jest.fn(() => "mockCache"),
        ApolloClient: jest.fn().mockImplementation(
          ({ link, cache }: { link: unknown; cache: unknown }) =>
            ({
              link,
              cache,
              query: jest.fn(),
              mutate: jest.fn(),
              subscribe: jest.fn(),
            } as unknown as ApolloClient<object>)
        ),
      };
    });
  });

  it("creates ApolloClient instance with link and cache", async () => {
    const client = (await import("./apollo-client")).default;
    expect(client).toBeDefined();
    expect("link" in client).toBe(true);
    expect("cache" in client).toBe(true);
  });

  it("calls createHttpLink with GraphQL endpoint", async () => {
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT = "http://test/graphql";
    await import("./apollo-client");
    const { createHttpLink } = await import("@apollo/client");
    expect(createHttpLink).toHaveBeenCalledWith({
      uri: "http://test/graphql",
    });
  });

  it("sets authorization header when token exists", async () => {
    localStorage.setItem("token", "test-token");
    const { setContext } = await import("@apollo/client/link/context");
    await import("./apollo-client");

    const contextFn = (setContext as jest.Mock).mock.calls[0][0] as ContextFn;
    const result = contextFn({}, { headers: { "x-test": "123" } });

    expect(result.headers).toEqual({
      "x-test": "123",
      authorization: "JWT test-token",
    });
  });

  it("sets empty authorization header when no token exists", async () => {
    const { setContext } = await import("@apollo/client/link/context");
    await import("./apollo-client");

    const contextFn = (setContext as jest.Mock).mock.calls[0][0] as ContextFn;
    const result = contextFn({}, { headers: { "x-test": "123" } });

    expect(result.headers).toEqual({
      "x-test": "123",
      authorization: "",
    });
  });
});
