export const messages = {
  "Missing Detail": "Please fill all the required field."
};

export const formStructure = {
  first_name: {
    label: "First Name",
    placeholder: "",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  last_name: {
    label: "Last Name",
    placeholder: "",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  customer_email: {
    label: "Email",
    placeholder: "",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  phone: {
    label: "Phone Number",
    placeholder: "",
    initialValue: "",
    type: "number",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  remarks: {
    label: "remarks",
    placeholder: "",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
};