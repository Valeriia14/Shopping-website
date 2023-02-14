import { Model } from "sequelize";
import { ModelOptions } from "sequelize/types";
import { gen_token } from "./string_utils";

const new_reference = (prefix = "mdlg", length = 8) => {
  if(prefix === "notPrefix"){
    return `${gen_token(length)}`.toUpperCase()
  }
  else {
   return `${prefix}:${gen_token(length)}`.toUpperCase()
  }
};
const generate_reference = <M extends Model>(model: M, { prefix = "mdlg", length = 8, key = "reference" }) => {
  const reference: any = model[key];
  if (!reference) model[key] = new_reference(prefix, length);
};

const scoped_model = <M extends typeof Model>(model_def: M, ...scopes: string[]): M => {
  for (const scope of scopes) {
    try {  
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return model_def.scope(scope);
    } catch (e) {
      if (e.name === "SequelizeScopeError") {
        // scope not declared, its fine.
      } else {
        throw e;
      }
    }
  }
  return model_def;
};

const model_defaults = (tablename: string, options?: ModelOptions): ModelOptions => {
  options = options || {};
  return {
    timestamps: true,
    freezeTableName: true,
    tableName: tablename,
    modelName: tablename,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
    omitNull: true,
    underscored: true,
    defaultScope: {
      attributes: {
        exclude: ["created_at", "updated_at", "deleted_at"],
      },
    },
    ...options,
  };
};

export default { model_defaults, scope: scoped_model, reference: generate_reference };