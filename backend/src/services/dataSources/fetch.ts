import { fetch } from "undici";

type RequestOptions = { headers?: { [key: string]: string }; body?: string };
const request = async <T>(
  url: string,
  method: "GET" | "POST",
  options?: RequestOptions
): Promise<T> => {
  let attempt = 0;
  while (true) {
    try {
      attempt++;
      const response = await fetch(url, {
        headers: options?.headers,
        method: method ?? "GET",
        body: options?.body,
      } as any);
      if (!!response?.headers?.get("x-credits-charged")) {
        console.log(
          "credits used: ",
          response?.headers?.get("x-credits-charged")
        );
      }
      const data = await response.json();
      return data as T;
    } catch (ex) {
      // will be approx 1 min
      if (attempt > 6) {
        throw ex;
      }
      const size = 1000;
      const backoff = attempt * 2 * size + Math.random() * size * 0.1;
      console.log(
        "Request failed.",
        "Attempt:",
        attempt,
        "Waiting",
        parseInt(backoff?.toString()),
        "ms",
        url,
        ex
      );
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
};
export default {
  get: async <T>(url: string, options?: RequestOptions): Promise<T> =>
    request<T>(url, "GET", options),
  post: async <T>(url: string, options?: RequestOptions): Promise<T> =>
    request<T>(url, "POST", options),
};
