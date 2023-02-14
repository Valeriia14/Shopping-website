import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import countryNames from "react-phone-number-input/locale/en.json";

export const messages = {
  "Missing Detail": "Please fill all the required field.",
};

export const formStructureBilling = {
  residential: {
    country: {
      position: "left",
      label: "Country",
      placeholder: "Singapore",
      initialValue: "",
      type: "select",
      validate: {
        presence: { allowEmpty: false, message: "is required" },
      },
      options: getCountries().map((item) => {
        return {
          countryName: countryNames[item],
          countryCode: `+${getCountryCallingCode(item)}`,
          code: item,
        };
      }),
      getOptionSelected: (option, value) => {
        if (value === "") {
          return true;
        } else return option?.countryName === value;
      },
      getOptionLabel: (option) =>
        option?.countryName + option?.code + `  ${option?.countryCode}`,
      getOptionLabels: (option) => option.countryName,
      handelChangeSelect: (e, value, reason, field, setSearch) => {
        if (reason === "select-option") {
          field.setValue(value?.countryName);
          setSearch((prev) => ({ ...prev, [field?.key]: value?.countryName }));
        } else if (reason === "clear") {
          field.setValue("");
          setSearch((prev) => ({ ...prev, [field?.key]: value?.countryName }));
        }
      },
      onInput: (e, value, reason, field, setSearch) => {
        if (reason === "input") {
          setSearch((prev) => ({ ...prev, [field?.key]: value }));
        }
      },
    },
    postal_code: {
      label: "Postal Code",
      placeholder: "xxxxxx",
      initialValue: "",
      type: "number",
      format: "######",
      validate: {
        presence: { allowEmpty: false, message: "is required" },
      },
    },
    address: {
      label: "Address",
      placeholder: "Blk 123A Woodlands Drive 51",
      initialValue: "",
      type: "text",
      validate: {
        presence: { allowEmpty: false, message: "is required" },
      },
      fullWidth: 12,
    },
    unit_no: {
      position: "left",
      label: "Unit No",
      placeholder: "# 01-01",
      initialValue: "",
      type: "number",
      format: "##-##",
      validate: {
        presence: { allowEmpty: false, message: "is required" },
      },
    },
    city: {
      label: "City",
      placeholder: "Your City",
      initialValue: "",
      type: "text",
      validate: {
        presence: { allowEmpty: false, message: "is required" },
      },
    },
  },
  office: {
    country: {
      position: "left",
      label: "Country",
      placeholder: "Singapore",
      initialValue: "",
      type: "select",
      validate: {
        presence: { allowEmpty: false, message: "is required" },
      },
      options: getCountries().map((item) => {
        return {
          countryName: countryNames[item],
          countryCode: `+${getCountryCallingCode(item)}`,
          code: item,
        };
      }),
      getOptionSelected: (option, value) => {
        if (value === "") {
          return true;
        } else return option?.countryName === value;
      },
      getOptionLabel: (option) =>
        option?.countryName + option?.code + `  ${option?.countryCode}`,
      getOptionLabels: (option) => option.countryName,
      handelChangeSelect: (e, value, reason, field, setSearch) => {
        if (reason === "select-option") {
          field.setValue(value?.countryName);
          setSearch((prev) => ({ ...prev, [field?.key]: value?.countryName }));
        } else if (reason === "clear") {
          field.setValue("");
          setSearch((prev) => ({ ...prev, [field?.key]: value?.countryName }));
        }
      },
      onInput: (e, value, reason, field, setSearch) => {
        if (reason === "input") {
          setSearch((prev) => ({ ...prev, [field?.key]: value }));
        }
      },
    },
    postal_code: {
      label: "Postal Code",
      placeholder: "xxxxxx",
      initialValue: "",
      type: "number",
      format: "######",
      validate: {
        presence: { allowEmpty: false, message: "is required" },
      },
    },
    address: {
      label: "Address",
      placeholder: "Blk 123A Woodlands Drive 51",
      initialValue: "",
      type: "text",
      validate: {
        presence: { allowEmpty: false, message: "is required" },
      },
      fullWidth: 12,
    },
    unit_no: {
      position: "left",
      label: "Unit No",
      placeholder: "# 01-01",
      initialValue: "",
      type: "number",
      format: "##-##",
      validate: {
        presence: { allowEmpty: false, message: "is required" },
      },
    },
    city: {
      label: "City",
      placeholder: "Your City",
      initialValue: "",
      type: "text",
      validate: {
        presence: { allowEmpty: false, message: "is required" },
      },
    },
    office_department: {
      position: "left",
      label: "Office Department",
      placeholder: "Your Office Department",
      initialValue: "",
      type: "text",
      validate: {
        presence: true,
      },
    },
  },
};
