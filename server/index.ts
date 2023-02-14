require("@kidztime/utilities");
require("@kidztime/config").default.__configure(`./config`);
require("@kidztime/models");

import config from "@kidztime/config";
import { allow_cors } from "@kidztime/middlewares";
import { SvAuthenticate, SvCronTask, SvMedia } from "@kidztime/services";
import { chirp, print_endpoints } from "@kidztime/utilities";
import register from "@react-ssr/express/register";
import body_parser from "body-parser";
import express from "express";
import fileupload from "express-fileupload";
import os from "os";

const DEFAULT_HTTP_PORT = 3000;

const app = express();
app.use(allow_cors());
app.use(express.static("public"));
app.use("/static-media", express.static(".gen/static"));

(async () => {
  await register(app);
  await SvAuthenticate.sync_privileges();
  await SvMedia.setup_local_repo(config.mediarepo.options);

  //cron job
  SvCronTask.startCronJob();



  app.use(fileupload({
    safeFileNames: true,
    preserveExtension: 5,
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  }));

  app.use(body_parser.json());
  app.use(body_parser.urlencoded({ extended: true }));

  app.use("/api/v1", require("./routes").default);
  app.use("/", require("./pages").default);

  const http_port = config.app.port || DEFAULT_HTTP_PORT;

  app.listen(http_port, () => {
    print_endpoints(app);
    chirp(`Ready on http://localhost:${http_port}`);
  });
})();
