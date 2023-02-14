import { ServerError } from "@kidztime/errors";
import { Configurations } from "@kidztime/config";

export class MailerError extends ServerError { }
export type MailerParams = {
  [index: string]: string;
};
export type SendMailerProps = {
  key: string;
  recipients: {
    name?: string;
    email: string;
    params?: MailerParams;
  }[];
};

/**
 * Object with send email method for each provider's configurations
 * 
 * @throws MailerError:send method not implemented - Method has not been created to send emails for this provider
 */
export class MailerProvider {
  namekey: string;
  constructor(configs: Configurations) {
    this.namekey = configs.name;
  }
  send(props: SendMailerProps): Promise<void> {
    throw new MailerError("send method not implemented");
  };
};