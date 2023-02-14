export const formStructure = {
  current_password: {
    label: "Current Password",
    placeholder: "******",
    initialValue: "",
    type: "textPassword",
    validate: {
      presence: { allowEmpty: false, message: "is required" }
    },
    fullWidth: 12
  },
  new_password: {
    label: "New Password",
    placeholder: "******",
    initialValue: "",
    type: "textPassword",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
      length: {
        minimum: 6,
        message: "must be at least 6 characters"
      },
      equality: {
        attribute: "current_password",
        message: "must be different from Current password",
        comparator: function (v1, v2) {
          return JSON.stringify(v1) !== JSON.stringify(v2);
        }
      }
    },
    fullWidth: 12
  },
  confirm_new_password: {
    label: "Confirm New Password",
    placeholder: "******",
    initialValue: "",
    type: "textPassword",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
      equality: "new_password"
    },
    fullWidth: 12
  }
};
