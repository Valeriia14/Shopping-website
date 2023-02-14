import { LogMessage } from "@kidztime/constants";
import { BadRequestError } from "@kidztime/errors";
import { cruder } from "@kidztime/middlewares";
import {
  RewardPoint,
  transact,
} from "@kidztime/models";
import { GenericOpts } from "../types";
import sequelize from 'sequelize';
import { Op } from 'sequelize';
import moment from "moment";

export const get_available_points = async (account_id: string) => {
  const sum = await RewardPoint.findOne({
    attributes: [
      [sequelize.fn('sum', sequelize.col('transaction_pts')), 'point_sum'],
      [sequelize.fn('sum', sequelize.col('transaction_value')), 'value_sum'],
    ],
    group: "account_id",
    where: {
      account_id: account_id,
      [Op.or]: [
        {
          expiry_date: {
            [Op.gte]: new Date()
          },
        },
        {
          expiry_date: null
        },
      ]
    }
  });

  const { point_sum, value_sum } = sum && sum.dataValues || {};
  return {
    point_sum: point_sum ? (point_sum > 0 ? point_sum : 0) : 0,
    value_sum: value_sum ? (value_sum > 0 ? value_sum : 0) : 0,
  };
};
