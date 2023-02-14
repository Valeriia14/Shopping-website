import { controller, Request, Response } from "@kidztime/middlewares";
import { Voucher } from "@kidztime/models";
import { Op } from "sequelize";

export default controller(async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const { ref } = req.params
  const voucher = await Voucher.findOne({
    where: {
      account_id: self?.id || null,
      order_id: null,
      name: ref,
      [Op.or]: [
        {
          expiry_date: {
            [Op.gte]: new Date()
          },
        },
        {
          expiry_date: null
        },
      ],
      log_status: false
    },
  });

  res.result.models = voucher;
});
