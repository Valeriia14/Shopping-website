import BigNumber from "bignumber.js"

export const BN_ZERO = new BigNumber(0);

export const uuidv4 = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const parseNumber = (input: string | number | BigNumber): BigNumber => {
  const value = new BigNumber(input);
  if (value.isNaN() || !value.isFinite())
    return BN_ZERO;
  return value;
}

export const formatMoney = (input: string | number | BigNumber): string => {
  const value = parseNumber(input);
  return value.toFormat(2);
}
