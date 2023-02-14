import { Configurations } from "@kidztime/config";
import fetch from "node-fetch";
import { MailerError, MailerProvider, SendMailerProps } from "./mailer_provider";
import { chirp } from "@kidztime/utilities";

/**
 * Retrieves configs, Verifies template used,
 * Inserts neccessary info to email,
 * Send email using API
 * 
 * @throws MailerError:template ID not found - template used is null
 * @throws MailerError:send failed - Email did not send, error msg will follow
 */
export namespace SendGrid {
  export const SendEndpoint = "https://api.sendgrid.com/v3/mail/send";
  export class SendGridProvider extends MailerProvider {
    api_key: string;
    send_configs: any;
    templates: { [index: string]: string };

    constructor(configs: Configurations) {
      super(configs);
      this.api_key = configs.api_key;
      this.templates = configs.templates;
      this.send_configs = configs.send_configs;
    };

    async send(props: SendMailerProps): Promise<void> {
      chirp(`sending sendgrid`, props.key);
      const template_id = this.templates[props.key]
      if (!template_id)
        throw new MailerError(`template ID not found:${template_id}`);
      const personalizations = props.recipients.map(recipient => ({
        to: [{
          name: recipient.name,
          email: recipient.email,
        }],
        dynamic_template_data: recipient.params,
      }));
      const payload = {
        template_id, 
        personalizations,
        ...this.send_configs,
      };
      const response = await fetch(SendEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.api_key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.status >= 400) {
        const body = await response.json();
        throw new MailerError(`send failed:${this.namekey}`, body.errors);
      }
      chirp(`sendgrid sent`, response.status, response.statusText);
    };
  };
};