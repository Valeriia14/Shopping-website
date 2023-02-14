export const formStructure = {
  card_number: {
    position: "left",
    label: "Card Number",
    initialValue: "",
    placeholder: "xxxx xxxx xxxx xxxx",
    format: "#### #### #### ####",
    validateCard: true,
    type: "number",
    validate: {
      presence: { allowEmpty: false, message: "is required" }
    }
  },
  cardholder_name: {
    label: "Cardholder Name",
    initialValue: "",
    placeholder: "Jane Doe ",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" }
    }
  },
  expiry_date: {
    position: "left",
    label: "Expiry Date",
    initialValue: "",
    placeholder: "MM/YY",
    type: "number",
    format: "##/##",
    validate: {
      presence: { allowEmpty: false, message: "is required" }
    }
  },
  cvc_cvv: {
    label: "CVC/CVV",
    initialValue: "",
    placeholder: "***",
    type: "numberPassword",
    inputType: "password",
    format: "###",
    validate: {
      presence: { allowEmpty: false, message: "is required" }
    }
  }
};
