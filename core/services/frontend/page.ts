import {
  Category,
  Character,
  ProductType,
  transact,
  Webpage,
  WebpageItem,
} from "@kidztime/models";
import { format_path, slugify } from "@kidztime/utilities";
import { GenericOpts } from "../types";
import { BadRequestError } from "@kidztime/errors";

type BodyProps = {
  name: string;
  type: string;
};
type CheckExist = {
  name: string;
  type: string;
  classification: any;
};

export const check_exist = async (
  props: CheckExist,
  opts: GenericOpts = {},
  crontask: boolean = false
) => {
  const updated_props = await transact(opts.transaction).run(
    async (transaction) => {
      let handle = slugify(props.name);
      const handle_conflicted = await Webpage.findOne({
        where: {
          path: format_path(props.type, handle!),
        },
        transaction,
      });
      if (handle_conflicted && !crontask) {
        throw new BadRequestError("path already created with handle");
      } else if (handle_conflicted && crontask) {
        handle = slugify(props.name + props.classification.id);
      }
      return { path: format_path(props.type, handle!) };
    }
  );
  return updated_props;
};

export const update_webpage = async (
  props: BodyProps,
  opts: GenericOpts = {}
) => {
  const webpage = await transact(opts.transaction).run<Webpage>(
    async (transaction) => {
      const { name, type } = props;
      const { path } = await check_exist(
        { name, type, classification: null },
        { transaction }
      );

      const webpage = await Webpage.findOne({
        where: {
          path: null,
        },
        transaction,
      });

      if (type === "product_type") {
        await WebpageItem.create(
          {
            webpage_id: webpage.id,
            type: WebpageItem.Type.ProductContent,
            position: WebpageItem.Position.Fixed,
          },
          { transaction }
        );
        await WebpageItem.create(
          {
            webpage_id: webpage.id,
            type: WebpageItem.Type.MediaAttributes,
            position: WebpageItem.Position.Fixed,
          },
          { transaction }
        );
        await WebpageItem.create(
          {
            webpage_id: webpage.id,
            type: WebpageItem.Type.FeatureCarousel,
            position: WebpageItem.Position.Fixed,
          },
          { transaction }
        );
      } else {
        await WebpageItem.create(
          {
            webpage_id: webpage.id,
            type: WebpageItem.Type.FeatureCarousel,
            position: WebpageItem.Position.Fixed,
          },
          { transaction }
        );
      }

      await webpage.update({
        status: Webpage.Status.Draft,
        path,
        type,
      });

      return {
        id: webpage.id,
        path: webpage.path,
      };
    }
  );
  return webpage;
};

export const update_webpage_cron_job = async (webpage: Webpage) => {
  const opts: GenericOpts = {};
  const { transaction } = opts;
  let classification
  if (webpage.type === Webpage.Type.Character) {
    classification = await Character.findOne({
      where: {
        webpage_id: webpage.id,
      }, transaction
    });
  } else if (webpage.type === Webpage.Type.Category) {
    classification = await Category.findOne({
      where: {
        webpage_id: webpage.id,
      },
    });
  } else {
    classification = await ProductType.findOne({
      where: {
        webpage_id: webpage.id,
      },
    });
  }
  if (classification) {
    const { path } = await check_exist(
      {
        name: classification.name,
        type: webpage.type,
        classification: classification,
      },
      {},
      true
    );
    await webpage.update({
      path,
    });

    if (webpage.type === "product_type") {
      await WebpageItem.create(
        {
          webpage_id: webpage.id,
          type: WebpageItem.Type.ProductContent,
          position: WebpageItem.Position.Fixed,
        },
        { transaction }
      );
      await WebpageItem.create(
        {
          webpage_id: webpage.id,
          type: WebpageItem.Type.MediaAttributes,
          position: WebpageItem.Position.Fixed,
        },
        { transaction }
      );
      await WebpageItem.create(
        {
          webpage_id: webpage.id,
          type: WebpageItem.Type.FeatureCarousel,
          position: WebpageItem.Position.Fixed,
        },
        { transaction }
      );
    } else {
      await WebpageItem.create(
        {
          webpage_id: webpage.id,
          type: WebpageItem.Type.FeatureCarousel,
          position: WebpageItem.Position.Fixed,
        },
        { transaction }
      );
    }
  }
};
