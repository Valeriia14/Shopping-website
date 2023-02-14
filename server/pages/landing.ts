import { Paths } from "@kidztime/constants";
import { render_page } from "@kidztime/middlewares";
import { Asset, Product, Account, Group } from "@kidztime/models";
import { Review } from "@kidztime/models/ugc";
import { Op } from "sequelize";

export default render_page(Paths.Views.Landing, async () => {
  const products_weekly_best = await Product.findAll({
    where: {
      promo_id: {
        [Op.not]: null,
      },
      status: Product.Status.Published,
    },
    include: [
      {
        model: Review,
        where: {
          status: Review.STATUS.published,
          deleted_at: null,
        },
        required: false,
      },
      {
        model: Asset,
        as: "PreviewImage",
      },
    {
      model: Group,
      as: "groups"
    }
  ],
  order: [['updated_at', 'DESC']],
  limit: 6,
  });

  const products_flash_promo_sale = await Product.findAll({
    where: {
      status: Product.Status.Published,
    },
    include: [
      {
        model: Review,
        where: {
          status: Review.STATUS.published,
          deleted_at: null,
        },
        required: false,
      },
      {
        model: Asset,
        as: "PreviewImage",
      },
      {
        model: Group,
        required: true,
        as: "groups",
        where: {
          home_feature_id: 1,
        },
      },
    ],
    order: [['updated_at', 'DESC']],
    limit: 7,
  });

  const products_sale = await Product.findAll({
    where: {
      status: Product.Status.Published,
    },
    include: [
      {
        model: Review,
        where: {
          status: Review.STATUS.published,
          deleted_at: null,
        },
        required: false,
      },
      {
        model: Asset,
        as: "PreviewImage",
      },
      {
        model: Group,
        required: true,
        as: "groups",
        where: {
          home_feature_id: 2,
        },
      },
    ],
    order: [['updated_at', 'DESC']],
    limit: 6,
  });

  const accessory_name = await Group.findOne({
    attributes: ["name"],
    where: {
      home_feature_id: 3,
    },
  });
  const accessories = await Product.findAll({
    where: {
      status:Product.Status.Published,
      promo_id: {
        [Op.not]: null
      },
    },
    include: [
      {
        model: Review,
        where: {
          status: Review.STATUS.published,
          deleted_at: null,
        },
        required: false,
      },
      {
        model: Asset,
        as: "PreviewImage",
      },
      {
        model: Group,
        required: true,
        as: "groups",
        where: {
          home_feature_id: 3,
        },
      },
    ],
    order: [['updated_at', 'DESC']],
  });

  const customer_reviews = await Review.findAll({
    where: {
      status: Review.STATUS.published,
      deleted_at: null,
      score: {
        [Op.gt]: 3,
      },
    },
    include: [
      {
        model: Account,
        required: true,
      },
      {
        model: Product,
        required: true,
        include: [{
          model: Asset,
          as: "PreviewImage",
        },
      ]
    }
    ],
    attributes: ["id","score", "comment", "created_at", 'updated_at'],
    order: [['updated_at', 'DESC']],
  });

  return {
    products_weekly_best,
    products_sale,
    products_flash_promo_sale,
    accessory: {
      name: accessory_name?.name || "",
      accessories,
    },
    customer_reviews,
  };
});
