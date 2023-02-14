import { StreamResult } from "@kidztime/middlewares";
import fs from "fs";
import os from "os";
import Path from "path";
import { gen_token } from "./string_utils";

export const write_to_file = async (stream_result: StreamResult): Promise<string> => {
  const temp_filepath = Path.join(os.tmpdir(), gen_token(16) + (stream_result.filename || ""));
  const write_stream = fs.createWriteStream(temp_filepath);
  stream_result.stream.pipe(write_stream);

  await new Promise((resolve, reject) => {
    write_stream.on("error", reject);
    write_stream.on("close", resolve);
  });
  return temp_filepath;
};