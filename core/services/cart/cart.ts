import { Op } from "sequelize";
import {
  Account,
  Asset,
  Product,
  Group,
  Session,
  CartItem,
  GroupProduct,
} from "@kidztime/models";
import { SvCart } from "..";
import { GenericOpts } from "../types";
import { make } from "@kidztime/middlewares";

import moment from "moment";

export type UpdateCartOwnerProps = {
  session_ids: any;
  self: Account;
};

export type DetailCartProps = {
  account_id: number;
};

export type CartIdProps = {
  arr_session: number[];
};

export type UpdateSessionProps = {
  // session_id: number;
  ended_at: any;
  status: string;
  pages: any;
  productpage: boolean;
};

export const update_session = async (
  props: UpdateSessionProps,
  session_id: number,
  opts: GenericOpts = {}
) => {
  const { transaction } = opts;
  await Session.update(
    {
      ...props,
    },
    {
      where: {
        id: session_id,
      },
      transaction,
    }
  );
};

export const cart_detail = async (
  props: CartIdProps,
  opts: GenericOpts = {}
) => {
  const cart = await Session.findAll({
    include: [
      {
        model: CartItem,
        include: [
          {
            model: Product,
            include: [
              {
                model: Asset,
                as: "PreviewImage",
              },
              {
                model: Group,
                as: "groups",
                include: [
                  {
                    model: GroupProduct,
                    as: "products_of_group",
                    include: [Product],
                  },
                ],
              },
              {
                model: GroupProduct,
                include: [Group],
              },
            ],
          },
        ],
        where: {
          status : CartItem.STATUS.created,
        }
      },
    ],
    where: {
      id: {
        [Op.in]: props.arr_session,
      },
    },
  });
  let cart_items = [];
  cart?.forEach((element: Session) => {
    cart_items.push(...element.dataValues.cart_items);
  });
  return {
    cart_items: cart_items,
  };
};

export const cart_detail_account = async (
  props: DetailCartProps,
  opts: GenericOpts = {}
) => {
  const { account_id } = props;
  const cart = await Account.findByPk(account_id!, {
    include: [
      {
        model: Session,
        as: "session",
        include: [
          {
            model: CartItem,
            include: [
              {
                model: Product,
                include: [
                  {
                    model: Asset,
                    as: "PreviewImage",
                  },
                  {
                    model: Group,
                    as: "groups",
                    include: [
                      {
                        model: GroupProduct,
                        as: "products_of_group",
                        include: [Product],
                      },
                    ],
                  },
                  {
                    model: GroupProduct,
                    include: [Group],
                  },
                ],
              },
            ],
            where: {
              status : CartItem.STATUS.created,
            }
          },
        ],
      },
    ],
  });
  let cart_items = [];
  cart?.dataValues?.session.forEach((element: Session) => {
    cart_items.push(...element.cart_items);
  });
  return {
    cart_items: cart_items,
  };
};

export const update_cart_owner = async (
  props: UpdateCartOwnerProps,
  opts: GenericOpts = {}
) => {
  const { transaction } = opts;
  const { session_ids, self } = props;
  await Session.update(
    {
      ended_at: moment(),
      status: Session.STATUS.ended,
    },
    {
      where: {
        status: Session.STATUS.active,
        account_id: self.id
      },
      transaction,
    }
  );
  await Session.update(
    {
      account_id: self?.id,
    },
    {
      where: {
        id: {
          [Op.in]: JSON.parse(session_ids),
        },
      },
    }
  );

  return await SvCart.cart_detail_account({
    account_id: self?.id,
  });
};

export const load_cart = (should_create = false) => {
  return make(async (req, res) => {
    if (req.extras!.cart) return;
    const self = req.extras!.self;
    const session_ids = req.cookies ? req.cookies["session_ids"] : null;
    if (self) {
      if (session_ids) {
        const cart = await SvCart.update_cart_owner({
          self: self,
          session_ids,
        });
        req.extras!.cart = cart;
        res.clearCookie("session_ids");
      } else {
        if (self?.session?.length > 0) {
          const cart = await SvCart.cart_detail_account({
            account_id: self?.id,
          });
          req.extras!.cart = cart;
        } else {
          const session = await Session.create({
            status: Session.STATUS.active,
            account_id: self?.id,
          });
          const cart = await SvCart.cart_detail_account({
            account_id: self?.id,
          });
          req.extras!.cart = cart;
        }
      }
    } else {
      if (!session_ids) {
        const session = await Session.create({
          status: Session.STATUS.active,
        });
        const arr_session = JSON.stringify([session?.id]);
        res.cookie("session_ids", arr_session, {
          maxAge: 2629746000, // one month
          path: "/",
          httpOnly: false,
        });
      } else {
        const arr_session = JSON.parse(session_ids);
        const cart = await SvCart.cart_detail({ arr_session });
        req.extras!.cart = cart;
      }
    }
  });
};
