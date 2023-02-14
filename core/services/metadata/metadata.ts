import { store_file } from "./../media/local_repo";
import { ObjectMeta, transact } from "@kidztime/models";
import CrudModel from "@kidztime/models/crud_model";
import { gen_token } from "@kidztime/utilities";
import { GenericOpts } from "../types";

export type MetadataProps = {
  model: CrudModel;
  owner_type: string;
  metadata: string;
};

export type PageMetadataProps = {
  handle?: string;

  key1?: string;
  key2?: string;
  key3?: string;
  key4?: string;
  key5?: string;
};

export type BulkPageMetadataProps = {
  page_metas: ObjectMeta[];
};

export type CreateBannerItemProps = {
  value: string;
  extra0: number;
  extra1: string;
};

export type CustomizeProps = {
  value?: string;
  ordering?: string;
  extra0?: string;
  extra1?: string;
  extra2?: string;
  extra3?: string;
  extra4?: string;
};

export const update_metadata = async (
  props: MetadataProps,
  opts: GenericOpts = {}
) => {
  const updated_metadata = await transact(opts.transaction).run(
    async (transaction) => {
      const metadata = await ObjectMeta.findOrCreate({
        where: {
          key: ObjectMeta.KEY.metadata,
          owner_id: props.model.id,
          owner_type: props.owner_type,
        },
        transaction,
      });

      await metadata[0].update(
        {
          value: props.metadata,
        },
        { transaction }
      );
      return metadata;
    }
  );
  return updated_metadata;
};

export const page_metadata = async (
  props: PageMetadataProps,
  opts: GenericOpts = {}
) => {
  const updated_object_meta = await transact(opts.transaction).run(
    async (transaction) => {
      let object_meta;

      if (props.handle) {
        object_meta = await ObjectMeta.findOne({
          where: {
            key: ObjectMeta.KEY.page_content,
            value: props.handle,
          },
          transaction,
        });
      } else {
        props.handle = gen_token(8);
        object_meta = await ObjectMeta.create({
          key: ObjectMeta.KEY.page_content,
          value: props.handle,
          transaction,
        });
      }

      if (props.key1) {
        await object_meta!.update(
          {
            extra0: props.key1,
          },
          { transaction }
        );
      }
      if (props.key2) {
        await object_meta!.update(
          {
            extra1: props.key2,
          },
          { transaction }
        );
      }
      if (props.key3) {
        await object_meta!.update(
          {
            extra2: props.key3,
          },
          { transaction }
        );
      }
      if (props.key4) {
        await object_meta!.update(
          {
            extra3: props.key4,
          },
          { transaction }
        );
      }
      if (props.key5) {
        await object_meta!.update(
          {
            extra4: props.key5,
          },
          { transaction }
        );
      }

      return object_meta;
    }
  );
  return updated_object_meta;
};

export const bulk_update_page_metadata = async (
  props: BulkPageMetadataProps,
  opts: GenericOpts = {}
) => {
  const updated_object_metas = await transact(opts.transaction).run(
    async (transaction) => {
      for (const object_meta of props.page_metas) {
        const update_object_meta = await ObjectMeta.findOne({
          where: {
            key: ObjectMeta.KEY.page_content,
            value: object_meta.handle,
          },
          transaction,
        });
        await update_object_meta!.update(
          {
            extra0: object_meta.key1,
            extra1: object_meta.key2,
            extra2: object_meta.key3,
            extra3: object_meta.key4,
            extra4: object_meta.key5,
          },
          { transaction }
        );
      }

      return props.page_metas;
    }
  );
  return updated_object_metas;
};

export const create_banner_item = async (
  props: CreateBannerItemProps,
  opts: GenericOpts = {}
) => {
  const object_meta = await transact(opts.transaction).run(
    async (transaction) => {
      const object_meta = await ObjectMeta.create(
        {
          key: ObjectMeta.KEY.banner,
          ...props,
        },
        { transaction }
      );
      return object_meta;
    }
  );
  return object_meta;
};

export const customize_page = async (
  props: CustomizeProps[],
  opts: GenericOpts = {}
) => {
  const object_meta = await transact(opts.transaction).run(
    async (transaction) => {
      const mArr = props.map((attr) => attr); //ex ['webTitle','metaDesc', ...]
      const findOrCreateMeta = async (attr: any) => {
        return await ObjectMeta.findOrCreate({
          where: {
            value: attr.value,
          },
          transaction,
          defaults: {
            key: ObjectMeta.KEY.settings,
            ...attr,
          },
        });
      };

      const findAndUpdate = async (attr: any) => {
        const record = await ObjectMeta.findOne({
          where: {
            key: ObjectMeta.KEY.settings,
            value: attr.value,
          },
        });
        if (!record) {
          return findOrCreateMeta(attr);
        }
        return record?.update({ ...attr });
      };

      const object_meta = await Promise.all(
        mArr.map((val) => findAndUpdate(val))
      );

      return object_meta;
    }
  );
  return object_meta;
};
