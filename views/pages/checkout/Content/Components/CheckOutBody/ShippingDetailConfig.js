export const messages = {
  "Missing Detail": "Please fill all the required field."
};

export const formStructure = {
  first_name: {
    label: "First Name",
    placeholder: "John",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  last_name: {
    label: "Last Name",
    placeholder: "Doe",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  email: {
    label: "Email",
    placeholder: "JohnDoe@gmail.com",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  phone_number: {
    label: "Phone Number",
    placeholder: "+65 xxx-xxx-xxx",
    initialValue: "",
    type: "number",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  delivery_address: {
    label: "Delivery Address",
    placeholder: "Address",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  postal_code: {
    label: "Postal Code",
    placeholder: "xxxxxx",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  notes_to_seller: {
    label: "Notes to seller",
    placeholder: "Notes to seller",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: true },
    },
  },
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