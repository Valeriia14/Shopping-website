export const TYPES = {
  UPDATE: "FILTER_UPDATE",
} as const;

export enum FilterKeys {
  USERS = "USERS"
}

export type FilterUpdateProps = {
  key: FilterKeys;
  value: any;
}

export function update(props: FilterUpdateProps) {
  return {
    type: TYPES.UPDATE,
    props
  }
}