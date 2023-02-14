import {
  getCountries,
  getCountryCallingCode
} from "react-phone-number-input/input";
import countryNames from "react-phone-number-input/locale/en.json";

export const messages = {
  "Missing Detail": "Please fill all the required field."
};

export const formStructure = {
  firstname: {
    label: "First Name",
    placeholder: "Jane",
    initialValue: "",
    type: "text",
    position: "left",
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  },
  lastname: {
    label: "Last Name",
    placeholder: "Doe",
    initialValue: "",
    type: "text",
    validate: {
      presence: { allowEmpty: false, message: "is required" }
    }
  },
  email_address: {
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
  country_code: {
    position: "left",
    label: "Country Code",
    placeholder: "+65",
    initialValue: "",
    type: "select",
    validate: {
      presence: { allowEmpty: false, message: "is required" }
    },
    options: getCountries().map((item) => {
      return {
        countryName: countryNames[item],
        countryCode: `+${getCountryCallingCode(item)}`,
        code: item
      };
    }),
    getOptionSelected: (option, value) => {
      if (value === "") {
        return true;
      } else return option?.countryCode === value;
    },
    getOptionLabel: (option) =>
      option?.countryName + option?.code + `  ${option?.countryCode}`,
    handelChangeSelect: (e, value, reason, field, setSearch) => {
      if (reason === "select-option") {
        field.setValue(value?.countryCode);
        setSearch((prev) => ({ ...prev, [field?.key]: value?.countryCode }));
      } else if (reason === "clear") {
        field.setValue("");
        setSearch((prev) => ({ ...prev, [field?.key]: "" }));
      }
    },
    getOptionLabels: (option) =>
      option.countryName + " " + option.countryCode,
    onInput: (e, value, reason, field, setSearch) => {
      if (reason === "input") {
        setSearch((prev) => ({ ...prev, [field?.key]: value }));
      }
    },
    widthxs: 4
  },
  phone_number: {
    inputEndRight: true,
    label: "Contact Number",
    placeholder: "xxx-xxx-xxx",
    initialValue: "",
    type: "number",
    inputType: "number",
    format: "###-###-###",
    validate: {
      presence: { allowEmpty: false, message: "is required" }
    },
    widthxs: 8
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
  confirm_password: {
    label: "Confirm Password",
    placeholder: "xxxxxxxx",
    initialValue: "",
    type: "textPassword",
    fullWidth: 12,
    validate: {
      presence: { allowEmpty: false, message: "is required" },
    },
  }
};