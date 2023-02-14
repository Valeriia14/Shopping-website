export const messages = {
  "Missing Detail": "Please fill all the required field."
};

export const formStructure = {
  delivery_address: {
    label: "Delivery Address",
    placeholder: "123 Sunshine Drive",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  postal_code: {
    label: "Postal Code",
    placeholder: "123456",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  remarks: {
    label: "Remarks",
    placeholder: "Any concerns/requirements?",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },

};