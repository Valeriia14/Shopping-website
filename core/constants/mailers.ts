export namespace Mailers {
  export const Keys = {
    "signup": "Sign up success email - sent after email verification success.",
    "email_verfication": "",
    "password_request": "",
    "password_request_cms": "",
    "password_reset_confirm": "",
    "verification_request": "",
    "resolve_exchange_request": "",
    "contact": ""
  };
  export const SignUpSchema = {
    key: "signup",
    params: {
      email: "Recipient email",
      name: "Signee name",
      subject: "Email subject",
      loginUrl: "Login URL",
      aboutUrl: "Learn more button",
      contactUrl: "Contact our support team",
      websiteUrl: "Footer website link",
    },
  };
  export const EmailVerificationSchema = {
    key: "email_verfication",
    params: {
      email: "Recipient email",
      subject: "Email subject",
      verificationUrl: "Verification URL link",
      websiteUrl: "Footer website link",
    },
  };
  export const PasswordRequestSchema = {
    key: "password_request",
    params: {
      email: "Recipient email",
      name: "Requestor name",
      subject: "Email subject",
      resetUrl: "Password reset URL link",
      expiration: "Link expiration text",
      websiteUrl: "Footer website link",
    },
  };
  export const PasswordRequestCMSSchema = {
    key: "password_request_cms",
    params: {
      email: "Recipient email",
      name: "Requestor name",
      subject: "Email subject",
      resetUrl: "Password reset CMS URL link",
      expiration: "Link expiration text",
      websiteUrl: "Footer website link",
    },
  };
  export const PasswordResetConfirmSchema = {
    key: "password_reset_confirm",
    params: {
      email: "Recipient email",
      name: "Requestor name",
      subject: "Email subject",
      ip_address: "IP address of event",
      time: "Time of event",
      location: "Geo location of ip address",
      contactUrl: "Contact our support team",
      websiteUrl: "Footer website link",
    },
  };
  export const VerificationRequestSchema = {
    key: "verification_request",
    params: {
      email: "Recipient email",
      subject: "Email subject",
      subject_name: "Recipient name",
      account: "Account name",
      verificationUrl: "URL to carry out verification",
      websiteUrl: "Footer website link",
    },
  };

  export const ResolveExchangeRequestSchema = {
    key: "resolve_exchange_request",
    params: {
      email: "Recipient email",
      subject: "Email subject",
      name: "Recipient Name",
      url: "Payment url to customer page, token attached",
      order_date: "date of order",
      order_ref: " reference of order",
      total_diff: "total diff amount to pay",
      receipt_diff: "receipt diff",
      additional_shipping_fee: "additional shipping fee",
      customer_name: "Customer Name",
      customer_email: "Email of Customer",
      customer_phone_number: "Phone number of customer",
      shipping_address: "Shipping Address",
      model: [ {} ]
    }
  }

  export const ContactSchema = {
    key: "contact",
    params: {
      subject: "Email subject",
      customer_email: "Sender email",
      first_name: "Sender first name",
      last_name: "Sender last name",
      phone: "Sender phone",
      remarks: "Remarks"
    }
  }
};
