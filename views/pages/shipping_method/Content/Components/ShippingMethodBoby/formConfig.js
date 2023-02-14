export const messages = {
  "Missing Detail": "Please fill all the required field.",
};

export const formStructure = {
  orderNoteShipOut: {
    note: {
      label: "Special instructions for your order",
      initialValue: "",
      type: "area",
      fullWidth: 12,
      validate: {
        presence: { allowEmpty: true },
      },
    },
  },
  orderNotePickUp: {
    note: {
      label: "Special instructions for your order",
      initialValue: "",
      type: "area",
      fullWidth: 12,
      validate: {
        presence: { allowEmpty: true },
      },
    },
  },
  FormNewAddress: {
    first_name: {},
    last_name: {},
    country_code: {},
    phone_number: {},
    divider: {},
    country: {},
    postal_code: {},
    address: {},
    address_2: {},
    unit_no: {},
    city: {},
  },
};
