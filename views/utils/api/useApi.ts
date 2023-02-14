import { HTTP, PathParams } from "../http";
import Endpoints from "./endpoints";
import doRedirect from "@ktwebsite/utils/doRedirect";
import moment from "moment";

export type RequestResult = {
  status: number;
  statusText: string;
  url: string;
  headers: Headers;
  data?: any;
};

export class RequestError extends Error {
  result: RequestResult;
  constructor(result: RequestResult, message?: string) {
    super(message);
    this.result = result;
    this.message = message || result.statusText;
  }
};

const parseResponse = async (response: Response) => {
  const { status, statusText, headers, url } = response;
  const result: RequestResult = { status, statusText, headers, url };
  try {
    const responseJson = await response.json();
    result.data = responseJson;
  } catch (e) { }
  if(response.status === 401){
    document.cookie = `authorization=; expires=${moment().format()}; path=/;`;
    localStorage.removeItem("sessionToken")
    doRedirect("/auth/signin")
  }
  if (response.status >= 400 && response.status < 600) {
    throw new RequestError(result, result.data?.error?.message);
  }

  return result;
};

export default () => {
  const win = typeof window === "undefined" ? undefined : window;
  const apiPrefix = `${win?.location?.protocol}//${win?.location?.host}/api/v1`;
  if (!apiPrefix) throw Error("No API host provided");
  const http = new HTTP(apiPrefix, Endpoints);
  const token = null;

  const defaultOptions = () => {
    const options: any = {
      headers: {},
    };

    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken && sessionToken !== "undefined") {
      options.headers.Authorization = `Bearer ${sessionToken}`;
    }

    return options;
  };

  const executor = (url: string) => ({
    get: async (options: any = {}) => await http.get({ url, ...defaultOptions(), ...options }).then(parseResponse),
    post: async (options: any = {}) => await http.post({ url, ...defaultOptions(), ...options }).then(parseResponse),
    del: async (options: any = {}) => await http.del({ url, ...defaultOptions(), ...options }).then(parseResponse),
    put: async (options: any = {}) => await http.put({ url, ...defaultOptions(), ...options }).then(parseResponse),
    multipost: async (options: any = {}) => await http.multi_post({ url, ...defaultOptions(), ...options }).then(parseResponse),
  });
  return {
    path: (path: keyof typeof Endpoints, routeParams?: PathParams, queryParams?: PathParams) => {
      const url = http.path(path, routeParams, queryParams);
      console.log("api", url);
      return executor(url);
    },
  };
};
