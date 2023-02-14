export const messages = {
  "Missing Detail": "Please fill all the required field."
};

export const formStructure = {
  name_on_card: {
    label: "Name on card",
    placeholder: "John Doe",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  card_number: {
    label: "Card number",
    placeholder: "xxxxxxxxxxxxxxxx",
    initialValue: "",
    type: "number",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  expiry: {
    label: "Expiry MM/YYYY",
    placeholder: "mm/yyyy",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  cvc: {
    label: "CVC",
    placeholder: "xxx",
    initialValue: "",
    type: "number",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  Primary_billing_address: {
    label: "Primary billing address",
    placeholder: "155 Main Street apt",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },

};
