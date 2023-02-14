import { check, ValidationChain, Meta } from "express-validator";
import moment from "moment";
import bcrypt from "bcrypt";

export type ValidationAccessor = string | string[];
export type ParamType = string[] | string;
export type ValidationChecker = (fields?: string | string[] | undefined, message?: any) => ValidationChain;
export type ValidationOptions = { checker?: ValidationChecker, accessor?: ValidationAccessor };
export type ChainOnly = { chain: ValidationChain }
export type ChainName = ChainOnly & { name: string };
export type ChainEnum = ChainOnly & { values: string[] | number[] }

const c_required = ({ chain, name }: ChainName) => {
  return chain.not().isEmpty().withMessage(`${name} is required`).bail();
};
const c_array_required = ({ chain, name }: ChainName) => {
  return chain.custom(value => Array.isArray(value))
    .withMessage(`${name} is required`).bail();
};
const c_object = ({ chain, name }: ChainName) => {
  return chain.custom(value => {
    if (typeof value !== "object") throw new Error();
    return true;
  }).withMessage(`${name} must be an object`).bail();
};
const c_id_array = ({ chain, name }: ChainName) => {
  return chain.custom(value => {
    for (const item of value)
      if (typeof item !== "number") throw new Error();
    return true;
  }).withMessage(`${name} must be an array of IDs`).bail();
};
const c_password = ({ chain }: ChainOnly) => {
  return chain.customSanitizer(value => typeof value === "string" ? bcrypt.hashSync(value, 10) : undefined);
};
const c_not_null = ({ chain, name }: ChainName) => {
  return chain.custom(value => {
    if (value === null) throw new Error();
    return true;
  }).withMessage(`${name} cannot be null`).bail();
};
const c_not_empty = ({ chain, name }: ChainName) => {
  return chain.custom(value => {
    if (value === "") throw new Error();
    return true;
  }).withMessage(`${name} cannot be empty`).bail();
};
const c_timestamp = ({ chain, name }: ChainName) => {
  return chain
    .customSanitizer(value => {
      if (typeof value === "number")
        return moment.unix(value);
      if (typeof value === "string" && value.match(/^\d{10}$/))
        return moment.unix(parseInt(value));
      return moment(value);
    }).custom(value => {
      if (!value.isValid()) throw new Error();
      return true;
    }).withMessage(`${name} is not a unix timestamp`).bail();
};
const c_enum = ({ chain, values }: ChainEnum) => {
  return chain.isIn(Object.values(values))
    .withMessage(`Accepted values: ${Object.values(values).join(" | ")}`).bail();
};
const c_number = ({ chain, name }: ChainName) => {
  return chain.isNumeric()
    .withMessage(`${name} must be a number`).bail();
};
const c_boolean = ({ chain, name }: ChainName) => {
  return chain.isBoolean()
    .withMessage(`${name} must be a true or false`).bail();
};
const c_format_field_name = (field: string) => {
  return field.replace(/[_-]/, " ");
};
const c_trim = ({ chain }: ChainOnly) => {
  return chain.customSanitizer(value => typeof value === "string" ? value.trim() : value);
};
const c_lowercase = ({ chain }: ChainOnly) => {
  return chain.customSanitizer(value => typeof value === "string" ? value.toLowerCase() : value);
};
const c_uppercase = ({ chain }: ChainOnly) => {
  return chain.customSanitizer(value => typeof value === "string" ? value.toUpperCase() : value);
};
const c_clean = ({ chain }: ChainOnly) => {
  return chain.customSanitizer(value => value === "" ? null : value);
};

const c_access = ({ chain, accessor }: ChainOnly & { accessor: string }) => {
  if (accessor.indexOf(".") < 0) return chain;
  const keys = accessor.split(".");

  return chain.customSanitizer((input: any, meta: Meta) => {
    let value = meta.req[meta.location];
    if (value === undefined || value === null) return value;

    for (const key of keys) {
      if (!value[key])
        return null;
      else
        value = value[key];
    }
    return value;
  });
};

const not_null = (inputs: ParamType,
  { checker = check, or_empty = true, lowercase = false, uppercase = false, trim = true }
    : ValidationOptions & { or_empty?: boolean, lowercase?: boolean, uppercase?: boolean, trim?: boolean }
    = {}
) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);

    let chain = checker(input);
    chain = c_access({ chain, accessor: input });

    if (trim)
      chain = c_trim({ chain });
    if (lowercase)
      chain = c_lowercase({ chain });
    if (uppercase)
      chain = c_uppercase({ chain });

    chain = c_not_null({ chain, name });
    if (or_empty) {
      chain = c_not_empty({ chain, name });
    }
    chains.push(chain);
  }
  return chains;
};
const trim = (inputs: ParamType,
  { checker = check, lowercase = false, uppercase = false, clean = true, accessor }
    : ValidationOptions & { lowercase?: boolean, uppercase?: boolean, clean?: boolean }
    = {}
) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    let chain = checker(input);
    chain = c_access({ chain, accessor: input });

    chain = c_trim({ chain });
    if (lowercase)
      chain = c_lowercase({ chain });
    if (uppercase)
      chain = c_uppercase({ chain });
    if (clean)
      chain = c_clean({ chain });
    chains.push(chain);
  }
  return chains;
};
const required = (inputs: ParamType,
  { checker = check, trim = true, lowercase = false, uppercase = false, accessor }
    : ValidationOptions & { trim?: boolean, lowercase?: boolean, uppercase?: boolean }
    = {}
) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);

    let chain = checker(input);
    chain = c_access({ chain, accessor: input });

    chain = c_required({ chain, name });
    if (trim)
      chain = c_trim({ chain });
    if (lowercase)
      chain = c_lowercase({ chain });
    if (uppercase)
      chain = c_uppercase({ chain });
    chains.push(chain);
  }
  return chains;
};
const enumtype = (inputs: ParamType, values: string[] | number[],
  { optional = false, checker = check, trim = true, clean = true, lowercase = false, uppercase = false, accessor }
    : ValidationOptions & { optional?: boolean, trim?: boolean, clean?: boolean, lowercase?: boolean, uppercase?: boolean }
    = {}
) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);

    let chain = checker(input);
    chain = c_access({ chain, accessor: input });

    if (!optional)
      chain = c_required({ chain, name });
    if (trim)
      chain = c_trim({ chain });
    if (clean)
      chain = c_clean({ chain });
    if (lowercase)
      chain = c_lowercase({ chain });
    if (uppercase)
      chain = c_uppercase({ chain });

    if (optional)
      chain.optional();
    chain = c_enum({ chain, values });
    chains.push(chain);
  }
  return chains;
};
const number = (inputs: ParamType,
  { optional = false, checker = check, accessor }
    : ValidationOptions & { optional?: boolean }
    = {}
) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);

    let chain = checker(input);
    chain = c_access({ chain, accessor: input });

    if (!optional)
      chain = c_required({ chain, name });
    chain = c_trim({ chain });

    if (optional)
      chain.optional();
    chain = c_number({ chain, name });
    chains.push(chain);
  }
  return chains;
};
const boolean = (inputs: ParamType,
  { optional = false, checker = check, accessor }
    : ValidationOptions & { optional?: boolean }
    = {}
) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);

    let chain = checker(input);
    chain = c_access({ chain, accessor: input });

    if (!optional)
      chain = c_required({ chain, name });
    chain = c_trim({ chain });

    if (optional)
      chain.optional();
    chain = c_boolean({ chain, name });
    chains.push(chain);
  }
  return chains;
};
const object = (inputs: ParamType,
  { optional = false, checker = check, accessor }
    : ValidationOptions & { optional?: boolean }
    = {}
) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);

    let chain = checker(input);
    chain = c_access({ chain, accessor: input });

    if (!optional)
      chain = c_required({ chain, name });
    if (optional)
      chain.optional();
    chain = c_object({ chain, name });
    chains.push(chain);
  }
  return chains;
};
const id_array = (inputs: ParamType,
  { optional = false, checker = check, accessor }
    : ValidationOptions & { optional?: boolean }
    = {}
) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);

    let chain = checker(input);
    chain = c_access({ chain, accessor: input });

    if (!optional)
      chain = c_array_required({ chain, name });
    if (optional)
      chain.optional();
    chain = c_id_array({ chain, name });
    chains.push(chain);
  }
  return chains;
};
const timestamp = (inputs: ParamType,
  { optional = false, checker = check, accessor }
    : ValidationOptions & { optional?: boolean }
    = {}
) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);

    let chain = checker(input);
    chain = c_access({ chain, accessor: input });

    if (!optional)
      chain = c_required({ chain, name });
    chain = c_trim({ chain });

    if (optional)
      chain.optional();
    chain = c_timestamp({ chain, name });
    chains.push(chain);
  }
  return chains;
};
const password = (inputs: ParamType,
  { optional = false, checker = check, accessor }
    : ValidationOptions & { optional?: boolean }
    = {}
) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);

    let chain = checker(input);
    chain = c_access({ chain, accessor: input });

    if (!optional)
      chain = c_required({ chain, name });
    c_password({ chain });
    chains.push(chain);
  }
  return chains;
};

export default {
  not_null,
  trim,
  required,
  enumtype,
  number,
  boolean,
  object,
  timestamp,
  id_array,
  password,
};