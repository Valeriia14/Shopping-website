import { LogMessage } from "@kidztime/constants";
import { BadRequestError } from "@kidztime/errors";
import { cruder, QueryOptions, query_meta } from "@kidztime/middlewares";
import {
  Character,
  transact,
  Webpage,
  WebpageItem,
  Asset,
} from "@kidztime/models";
import { slugify, format_path } from "@kidztime/utilities";
import { Op } from "sequelize";
import { SvLog } from "..";
import { GenericOpts } from "../types";

type SetCharacterLinksProps = {
  main_id: number;
  child_ids: number[];
  parent_ids: number[];
};
type CheckCharacterHandleProps = {
  handle?: string;

  character_id?: number;
  update?: boolean;
};

type CheckCharacterProps = {
  name: string;
  handle?: string;

  character_id?: number;
  update?: boolean;
};

export type CreateCharacterProps = {
  type: string;
  name: string;
  description?: string;
  handle?: string;
  meta_keywords?: string;
  meta_title?: string;
  extras?: string;
  published: boolean;
  published_at: Date | null;
  gender: string;

  actor_id: number;
};

type UpdateCharacterProps = {
  character: Character;

  type?: string;
  name?: string;
  description?: string;
  handle?: string;
  meta_keywords?: string;
  meta_title?: string;
  extras?: string;
  published?: boolean;
  published_at?: Date | null;
  asset_id?: number;
  gender?: string;

  actor_id?: number;
};

type FindByCharacterLinkProps = {
  character_link_type_ids: any;
  options: QueryOptions;
  exists: boolean;
};

export const check_character_handle = async (
  props: CheckCharacterHandleProps,
  opts: GenericOpts = {}
) => {
  const updated_handle = await transact(opts.transaction).run(
    async (transaction) => {
      const where =
        props.update === true
          ? {
              handle: props.handle,
              id: { [Op.ne]: props.character_id },
            }
          : {
              handle: props.handle,
            };
      const product_handle_conflict = await Character.findOne({
        where,
        transaction,
      });
      if (product_handle_conflict)
        throw new BadRequestError("character with handle already exists");
    }
  );
};

export const check_character = async (
  props: CheckCharacterProps,
  opts: GenericOpts = {}
) => {
  const updated_props = await transact(opts.transaction).run(
    async (transaction) => {
      const where =
        props.update === true
          ? {
              name: props.name,
              id: { [Op.ne]: props.character_id },
            }
          : {
              name: props.name,
            };

      const name_conflicted_product = await Character.findOne({
        where,
        transaction,
      });
      if (name_conflicted_product)
        throw new BadRequestError("character already created with name");

      if (
        props.handle === null ||
        (props.handle === undefined && props.update !== true)
      ) {
        props.handle = slugify(props.name);
      } else if (props.update === true) {
      } else {
        props.handle = slugify(props.handle!);
      }

      await check_character_handle(
        { ...props },
        { transaction: opts.transaction }
      );

      return props;
    }
  );
  return updated_props;
};

export const create_character = async (
  props: CreateCharacterProps,
  opts: GenericOpts = {}
) => {
  const character = await transact(opts.transaction).run<Character>(
    async (transaction) => {
      const { handle } = await check_character(
        { name: props.name, handle: props.handle },
        { transaction }
      );
      props.handle = handle;

      let gender: any = {};

      switch (props.gender) {
        case "Female":
          gender.if_girl = true;
          break;
        case "Male":
          gender.if_boy = true;
          break;
        default:
          gender.if_girl = true;
          gender.if_boy = true;
          break;
      }
      const character = await Character.create(
        {
          ...props,
          ...gender,
        },
        { transaction }
      );
      await character.reload({ transaction });

      await Webpage.update(
        {
          path: format_path(props.type, props.handle!),
          type: Webpage.Type.Character,
        },
        { where: { id: character.webpage_id }, transaction }
      );

      await WebpageItem.create(
        {
          webpage_id: character.webpage_id,
          type: WebpageItem.Type.FeatureCarousel,
          position: WebpageItem.Position.Fixed,
        },
        { transaction }
      );

      await SvLog.log_activity(
        {
          character: Character.name,
          description: LogMessage.CreateCharacter,
          owner: character,
          actor_id: props.actor_id,
          ip_address: opts.ip_address,
        },
        { transaction }
      );

      return character;
    }
  );
  return character;
};

export const update_character = async (
  props: UpdateCharacterProps,
  opts: GenericOpts = {}
) => {
  const updated_character = await transact(opts.transaction).run<Character>(
    async (transaction) => {
      if (props.name) {
        const { handle } = await check_character(
          {
            name: props.name,
            handle: props.handle,
            character_id: props.character.id,
            update: true,
          },
          { transaction }
        );
        props.handle = handle;
      } else if (props.handle !== null) {
        await check_character_handle(
          {
            handle: props.handle,
            character_id: props.character.id,
            update: true,
          },
          { transaction }
        );
      }
      let gender: any = {};

      switch (props.gender) {
        case "Female":
          gender.if_girl = true;
          gender.if_boy = false;
          break;
        case "Male":
          gender.if_girl = false;
          gender.if_boy = true;
          break;
        default:
          gender.if_girl = true;
          gender.if_boy = true;
          break;
      }

      await cruder.processor(
        props.character,
        { ...props, ...gender },
        Character.crud.update
      );
      await props.character.save({ transaction });

      if (props.asset_id) {
        await Asset.destroy({
          where: {
            id: { [Op.ne]: props.asset_id },
            owner_type: Character.name,
            owner_id: props.character.id,
            assoc_type: Character.TYPE,
          },
          transaction,
        });

        await Asset.update(
          {
            owner_type: Character.name,
            owner_id: props.character.id,
            assoc_type: Character.TYPE,
            deleted_at: null,
          },
          {
            where: {
              id: props.asset_id,
            },
            transaction,
          }
        );
      }

      await SvLog.log_activity(
        {
          character: Character.name,
          description: LogMessage.UpdateCharacter,
          owner: props.character,
          actor_id: props.actor_id,
          ip_address: opts.ip_address,
        },
        { transaction }
      );

      return props.character;
    }
  );
  return updated_character;
};
