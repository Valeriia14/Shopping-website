import { EventLog, transact } from "@kidztime/models";
import moment from "moment";
import { GenericOpts } from "@kidztime/services/types";
import CrudModel from "@kidztime/models/crud_model";

export type LogProps = {
  category?: string;
  character?: string;
  product_type?: string;
  description: string;
  owner: CrudModel;
  actor_id: number;
  account_id?: number;
  ip_address?: string;
};

const log_activity = async (props: LogProps, opts: GenericOpts = {}) => {
  await transact(opts.transaction).run(async (transaction) => {
    await EventLog.create({
      timestamp: moment(),
      category: props.category,
      description: props.description,
      owner_type: props.owner.constructor.name,
      owner_id: props.owner.id,
      actor_id: props.actor_id,
      account_id: props.account_id,
      ip_address: props.ip_address,
    }, { transaction });
  });
};

export { log_activity };