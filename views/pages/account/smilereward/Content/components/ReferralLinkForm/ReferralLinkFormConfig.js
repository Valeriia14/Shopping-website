export const messages = {
  "Missing Detail": "Please fill all the required field."
};

export const formStructure = {
  personal_link: {
    label: "Personal Link",
    placeholder: "",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: true, message: "is required" },
    },
  },

};