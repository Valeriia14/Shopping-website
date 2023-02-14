export const env = process.env.REACT_APP_ENVIRONMENT;
import config from "./config.dev"

let actualConfig;
switch(env) {
  case 'dev':
    actualConfig = config;
    break;
  default:
    actualConfig = config;
}

export default actualConfig;
