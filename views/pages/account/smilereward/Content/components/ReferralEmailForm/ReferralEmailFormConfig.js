export const messages = {
  "Missing Detail": "Please fill all the required field."
};

export const formStructure = {
  email: {
    label: "Email",
    placeholder: "",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  message: {
    label: "Message",
    placeholder: "",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: true, message: "is required" },
    },
  },
};