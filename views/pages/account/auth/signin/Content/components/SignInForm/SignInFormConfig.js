export const messages = {
  "Missing Detail": "Please fill all the required field."
};

export const formStructure = {
  email: {
    label: "Email Address",
    placeholder: "jane.doe@example.com",
    initialValue: "",
    type: "text",
    fullWidth: 12,
    validate: {
      presence: { allowEmpty: false, message: "is required" },
      email: true
    },
  },
  password: {
    label: "Password",
    placeholder: "xxxxxxxx",
    initialValue: "",
    type: "textPassword",
    fullWidth: 12,
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
};