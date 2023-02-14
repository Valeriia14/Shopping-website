import { Account } from '@kidztime/models';
import { Transaction } from "sequelize/types";
export type GenericOpts = {
    transaction?: Transaction;
    ip_address?: string;
};
export const update_user_profile = async(account_id: number, props: any, opts: GenericOpts={}) =>{
    const account = await Account.findByPk(account_id)
    return await account?.update(props)
}