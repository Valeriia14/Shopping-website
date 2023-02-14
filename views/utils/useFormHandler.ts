import { ChangeEvent, useEffect, useState } from "react";
import validate from "validate.js";

type TextChangeEvent = ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;

export type FormField = {
  label: string;
  placeholder?: string;
  initialValue?: string;
  type: "text" | "password";
  validate?: any;
};
export type FormStructure = {
  [index: string]: FormField;
};
export type FieldErrors = {
  [index: string]: string[];
};
export type FieldDirtys = {
  [index: string]: boolean;
};

const defaultEventParser = (event: TextChangeEvent) => event.target.value;

export default (formStructure: FormStructure) => {
  const initialInputs: any = {};
  const formSchema: any = {};
  for (const key in formStructure) {
    const { initialValue, validate } = formStructure[key];
    initialInputs[key] = initialValue !== null ? initialValue : null;
    if (validate)
      formSchema[key] = validate;
  }
  const [inputs, setInputs] = useState(initialInputs);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [dirtys, setDirtys] = useState<FieldDirtys>({});

  useEffect(() => {
    const errors = validate(inputs, formSchema);
    setErrors(errors);

    // eslint-disable-next-line
  }, [inputs]);

  const onChange = (field: string) => {
    return (event: ChangeEvent<any>) => {
      const value = defaultEventParser(event);

      setInputs((prevInputs: any) => ({
        ...prevInputs,
        [field]: value,
      }));
      setDirtys((prevDirtys: FieldDirtys) => ({
        ...prevDirtys,
        [field]: true,
      }));
    };
  };

  const setValue = (field: string) => {
    return (value: string) => {
      setInputs((prevInputs: any) => ({
        ...prevInputs,
        [field]: value,
      }));
    };
  };

  const onBlur = (field: string) => {
    return () => {
      setDirtys((prevDirtys: FieldDirtys) => ({
        ...prevDirtys,
        [field]: true,
      }));
    };
  };

  const clearForm = () => {
    setInputs(initialInputs);
    setDirtys({});
  }

  const fields = [];
  for (const key in formStructure) {
    fields.push({
      key,
      onChange: onChange(key),
      onBlur: onBlur(key),
      spec: formStructure[key],
      value: inputs[key],
      setValue: setValue(key),
      dirty: dirtys[key],
      ...!!errors && {
        error: errors[key] && errors[key][0],
      },
    });
  }

  return [fields, inputs, errors , setInputs, clearForm ,setErrors , setDirtys];
};
