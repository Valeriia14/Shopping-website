import * as local_repo from "./local_repo";
import * as s3_repo from "./s3_repo";

export default {
  ...local_repo,
  ...s3_repo
};