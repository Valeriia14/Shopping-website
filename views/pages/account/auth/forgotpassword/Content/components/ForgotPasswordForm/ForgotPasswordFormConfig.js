export const messages = {
  "Missing Detail": "Please fill all the required field."
};

export const formStructure = {
  email: {
    label: "Email",
    placeholder: "jane.doe@example.com",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
};
