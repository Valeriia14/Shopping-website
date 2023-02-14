import {
  getCountries,
  getCountryCallingCode
} from "react-phone-number-input/input";
import countryNames from "react-phone-number-input/locale/en.json";

export const messages = {
  "Missing Detail": "Please fill all the required field."
};

export const formStructure = {
  first_name: {
    position: "left",
    label: "First Name",
    placeholder: "John",
    initialValue: "",
    inputType: "text",
    validate: {
      presence: true
    }
  },
  last_name: {
    label: "Last Name",
    placeholder: "Doe",
    initialValue: "",
    type: "text",
    validate: {
      presence: true
    }
  },
  email_address: {
    position: "left",
    label: "Email Address",
    placeholder: "Jane_Doe@gmail.com",
    initialValue: "",
    type: "text",
    validate: {
      presence: true
    }
  },
  country_code: {
    label: "Country Code",
    placeholder: "+65",
    initialValue: "",
    type: "select",
    validate: {
      presence: true
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
    getOptionLabels: (option) => option.countryName + " " + option.countryCode,
    onInput: (e, value, reason, field, setSearch) => {
      if (reason === "input") {
        setSearch((prev) => ({ ...prev, [field?.key]: value }));
      }
    },
    width: 2
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
      presence: true
    },
    width: 4
  },
  date_of_birth: {
    position: "left",
    label: "Date Of Birth",
    placeholder: "DD/MM/YYYY",
    initialValue: "",
    type: "datePicker",
    validate: {
      presence: true
    },
    width: 6
  },
  divider: {
    type: "changePasswordComponent",
    widthonlyxs: 6,
    width: 2
  }
};
