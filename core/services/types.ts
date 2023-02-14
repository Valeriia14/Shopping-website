import { Transaction } from "sequelize/types";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};