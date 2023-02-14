import CrudModel from "@kidztime/models/crud_model";
import { slugify } from "@kidztime/utilities";
import { Model } from "sequelize/types"
import { GenericOpts } from "../types"

interface HandleOpts extends GenericOpts {
  column?: string
}

export const generate_next_handle = (handle: string) => {
  const suffixMatch = handle.match(/-(\d+)$/)
  if (!suffixMatch)
    return `${handle}-0`;
  
  const nextNumber = parseInt(suffixMatch[1]) + 1;
  return `${handle.substring(0, suffixMatch.index)}-${nextNumber}`;
}

export const generate_unique_handle = async (name_or_reference: string, model: typeof CrudModel, opts: HandleOpts = {}) => {
  const column = opts.column ?? "handle";
  let handle = slugify(name_or_reference);
  let handle_available = false;
  let attempts = 0;

  while (!handle_available && attempts < 1000) {
    handle_available = await model.count({
      where: {
        [column]: handle,
      },
      transaction: opts.transaction,
    }) === 0;
    if (!handle_available)
      handle = generate_next_handle(handle);
  }

  if (!handle_available)
    throw new Error(`cannot generate handle: ${name_or_reference}`);

  return handle;
}
