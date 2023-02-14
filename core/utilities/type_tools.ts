export type ValueOf<T> = T[keyof T];
export const toValueKeyMap = (input: { [index: string]: string }) => {
  const output: { [index: string]: string } = {};
  for (const key in input)
    output[input[key]] = key;
  return output;
};