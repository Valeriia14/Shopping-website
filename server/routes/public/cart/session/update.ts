import { controller, Request, Response } from "@kidztime/middlewares";
import { CartItem, Session } from "@kidztime/models";
import moment from "moment";
import { Transaction } from "sequelize/types";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default controller(async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const opts: GenericOpts = {};
  const { transaction } = opts;
  const { session_ids, isLoadcart, productDetailPage } = req.body;
  if (!self) {
    if (JSON.parse(session_ids)?.length >= 1 && !isLoadcart) {
      await Session.update(
        {
          ended_at: moment(),
          status: Session.STATUS.ended,
        },
        {
          where: {
            id: JSON.parse(session_ids)?.slice(-1),
          },
          transaction,
        }
      );
      const session = await Session.create({
        status: Session.STATUS.active,
      });
      const arr_session = JSON.stringify([
        ...JSON.parse(session_ids),
        session?.id,
      ]);
      res.cookie("session_ids", arr_session, {
        maxAge: 2629746000, // one month
        path: "/",
        httpOnly: false,
      });
    } else if (isLoadcart) {
      const session = await Session.findOne({
        where: {
          id: JSON.parse(session_ids)?.slice(-1),
        },
      });
      await Session.update(
        {
          pages: session?.dataValues?.pages + 1,
          productpage: productDetailPage ? true : true,
        },
        {
          where: {
            id: JSON.parse(session_ids)?.slice(-1),
          },
          transaction,
        }
      );
    }
  } else {
    if (!isLoadcart) {
      await Session.update(
        {
          ended_at: moment(),
          status: Session.STATUS.ended,
        },
        {
          where: {
            id: self.session.slice(-1)[0].dataValues.id,
          },
          transaction,
        }
      );
      const session = await Session.create({
        status: Session.STATUS.active,
        account_id: self.id,
      });
    } else {
      await Session.update(
        {
          pages: self.session.slice(-1)[0].dataValues.pages + 1,
          productpage: productDetailPage ? true : true,
        },
        {
          where: {
            id: self.session.slice(-1)[0].dataValues.id,
          },
          transaction,
        }
      );
    }
  }
  res.result = {};
});
//authorization
