export const messages = {
  "Missing Detail": "Please fill all the required field."
};

export const formStructure = {
  firstname: {
    label: "First Name",
    placeholder: "",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  email: {
    label: "Email",
    placeholder: "",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
};