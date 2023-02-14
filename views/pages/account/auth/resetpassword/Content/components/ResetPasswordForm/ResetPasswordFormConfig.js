export const messages = {
  "Missing Detail": "Please fill all the required field."
};

export const formStructure = {
  password: {
    label: "Password",
    placeholder: "xxxxxxxx",
    initialValue: "",
    type: "password",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  confirm_password: {
    label: "Re-Enter Password",
    placeholder: "xxxxxxxx",
    initialValue: "",
    type: "password",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
};
