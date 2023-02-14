import { base32Encode } from "@ctrl/ts-base32";
import Crypto from "crypto";
import { Headers } from "node-fetch";
import moment from "moment";
import BigNumber from "bignumber.js";

export const BN_ZERO = new BigNumber(0);

export const number_or_zero = (input: any): number => {
  switch (typeof input) {
    case "number": return input;
    default:
      return is_number(input) ? Number(input) : 0;
  }
};

export const is_number = (input: any): boolean => {
  return !isNaN(input) && isFinite(input);
};

export const gen_token = (length = 32) => {
  return base32Encode(Crypto.randomBytes(length / 2 + 1)).toLowerCase().replace(/[^a-z0-9]/g, '').substr(-length);
};

export const get_header_filename = (headers: Headers, default_value?: string): string | undefined => {
  const filename_header = headers.get("Content-Disposition")?.split(";").filter(pair => pair.trim().split("=")[0] === "filename")[0];
  const filename = (filename_header?.includes("=") && filename_header?.split("=")[1]);
  return filename || default_value;
};

export const get_content_ext = (headers: Headers, default_value?: string): string | undefined => {
  return headers.get("Content-Type")?.split("/")[1] || default_value;
};

export const log = (...args: any[]) => {
  let timestamp = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
  console.log(timestamp, ...args);
};

export const slugify = (handle: string) => {
  return handle.toLowerCase().replace(/[^\w]+/g, '-').replace(/-{2,}/g, '-');
};

export const try_json = (stringified: string | null | undefined) => {
  if (typeof stringified !== "string") return stringified ?? {};
  try {
    return JSON.parse(stringified ?? "");
  } catch (error) {}
  return {};
}

export const format_path = (type: string, path: string) => {
  return '/' + type.replace('_', '-') + '/' + path;
}
