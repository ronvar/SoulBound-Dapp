export const API_EXPRESS_LOCAL_URL = "http://localhost:3005";
export const API_EXPRESS_PROD_URL = "";
export const API_EXPRESS_BASE_URL =
  process.env.NODE_ENV === "production"
  ? API_EXPRESS_PROD_URL
    : API_EXPRESS_LOCAL_URL;

const DAPP_EXPRESS_DEFAULT_HEADERS = {
  Accept: "application/json",
};

type RequestOptions = {
  headers?: { [key: string]: string };
  body?: string | FormData;
};

const request = async (
  url: string,
  method: "GET" | "POST",
  options?: RequestOptions,
  cache?: number,
  credentials?: boolean
) => {
  let attempt = 0;
  while (true) {
    try {
      attempt++;

      const response = await fetch(url, {
        mode: "cors",
        headers: options?.headers,
        method: method ?? "GET",
        body: options?.body,
        credentials: credentials ? "include" : "omit",
      } as any);
      if (response.status === 401) {
        console.log("Unauthorized");
        attempt = 4;
        return response;
      }
      const data = await response.json();
      return data;
    } catch (ex) {
      if (attempt > 6) {
        throw ex;
      }
      const size = 1000;
      const backoff = attempt * 2 * size + Math.random() * size * 0.1;
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
};

export const fetcher = {
  get: async <T>(
    url: string,
    options?: RequestOptions,
    cache?: number
  ): Promise<T> => request(url, "GET", options, cache),
  post: async <T>(
    url: string,
    options?: RequestOptions,
    cache?: number
  ): Promise<T> => request(url, "POST", options, cache),
};

const mergeHeaders = (options?: RequestOptions) => ({
  ...DAPP_EXPRESS_DEFAULT_HEADERS,
  ...options?.headers,
});

const apiUrl = (url: string) => API_EXPRESS_BASE_URL + url;

const dappApi = {
  get: async <T>(
    url: string,
    options?: RequestOptions,
    cache?: number
  ): Promise<T> =>
    request(
      apiUrl(url),
      "GET",
      {
        ...options,
        headers: mergeHeaders(options),
      },
      cache,
      true
    ),
  post: async <T>(
    url: string,
    options?: RequestOptions,
    cache?: number,
    noDefaultHeaders?: boolean
  ): Promise<T> =>
    request(
      apiUrl(url),
      "POST",
      {
        ...options,
        headers: noDefaultHeaders ? {} : mergeHeaders(options),
      },
      cache,
      true
    ),
};

export default dappApi;
