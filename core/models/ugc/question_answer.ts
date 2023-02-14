import { Account } from '@kidztime/models';
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";
import { Category } from '../classification';
import CrudModel, { CrudSpec } from "../crud_model";
import { Product } from "../product";

const sequelize = Datasource.source("default-db");

class QuestionAnswer extends CrudModel {
  static TABLENAME = "question_answer";
  
  static STATUS = {
    published: "published",
    unpublished: "unpublished",
    canceled: "canceled"
  } as const;

  public product_id!: number;
  public account_id!: number;
  public design_id!: number;

  public question!: string | null;
  public answer!: string | null;
  public email!: string | null;
  public first_name!: string | null;
  public type!: string | null;
  public status!: string | null;
  public qa_category!: string | null;
  public is_public!: boolean | null;
  public uses_email!: boolean | null;

  

  static TYPES = {
    qa: 'q&a',
    faq: 'faq'
  } as const;
  //associations
  public product!: Product | null;
  public account!: Account | null;
  public product_type!: ProductType | null;
  
  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

QuestionAnswer.init({
  product_id: model_specs.foreign_key(true),
  account_id: model_specs.foreign_key(false),
  design_id: model_specs.foreign_key(false),
  question: model_specs.generic_string(),
  answer: model_specs.generic_string(),
  email: model_specs.generic_string(),
  first_name: model_specs.generic_string(),
  type: model_specs.generic_string(),
  status: model_specs.generic_string(),
  qa_category: model_specs.generic_string(),
  is_public: model_specs.boolean(),
  uses_email: model_specs.boolean(),
}, {
  ...model_utils.model_defaults(QuestionAnswer.TABLENAME),
  defaultScope: {},
  sequelize,
});

QuestionAnswer.crud = new CrudSpec();
QuestionAnswer.crud.search = ["question", "answer", "type", "status", "category", "is_public", "uses_email", "email", "first_name"];
QuestionAnswer.crud.create = ["question", "answer", "type", "status", "design_id", "qa_category", "is_public", "uses_email", "email", "first_name"];
QuestionAnswer.crud.update = ["question", "answer", "type", "status", "qa_category", "design_id", "is_public", "uses_email", "email", "first_name"];
export default QuestionAnswer;