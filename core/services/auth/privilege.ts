import { Privileges, LogMessage } from "@kidztime/constants";
import { BadRequestError } from "@kidztime/errors";
import { Privilege, transact, Account, AccountPrivilege } from "@kidztime/models";
import { GenericOpts } from "@kidztime/services/types";
import SvLog from "@kidztime/services/logger";

export type AddPrivilegeProps = {
  recipient: Account;
  privileges: string[];
  actor_id: number;
};

export type UpdatePrivilegeProps = {
  recipient: Account;
  privileges: number[];
  actor_id: number;
};

export type UpdateAccountPrivilegeProps = {
  recipient: Account;
  privileges: number[];
  actor_id: number;
};

/**
 * Retrieves prior privileges from Object.keys,
 * Create unmatched privileges,
 * Insert each and save it into privilege
 * 
 * @param opts - {@link GenericOpts} transaction object that executes sync
 */
export const sync_privileges = async (opts: GenericOpts = {}) => {
  await transact(opts.transaction).run(async (transaction) => {
    const privilege_names = Object.keys(Privileges);
    const privileges: Privilege[] = await Privilege.findAll<Privilege>({ where: { name: privilege_names }, transaction });

    for (const name of privilege_names) {
      const privilege = privileges.find(item => item.name === name);
      const { domain, label, manageable, type, description } = Privileges[name];
      if (!privilege) {
        await Privilege.create({
          label, description,
          name, domain, type,
          manageable,
        }, { transaction });
        continue;
      }

      privilege.domain = domain;
      privilege.type = type;
      privilege.manageable = manageable;
      privilege.label = label;
      privilege.description = description || null;
      await privilege.save({ transaction });
    }
  });
};

/**
 * Retrieves all privileges where it matches the new privileges if applicable,
 * Filters through addable privileges, Throws error for invalid privileges,
 * Adds valid new privileges and sets it to recipient
 * 
 * @param props - {@link AddPrivilegeProps} Has recipient as Enity or AccountEntity object and privileges in string array
 * @param opts - {@link GenericOpts} Has transaction object that executes sync
 * 
 * @throws BadRequestError:invalid privilege - addable privilege names are not valid
 */
export const add_privilege = async (props: AddPrivilegeProps, opts: GenericOpts = {}) => {
  const { recipient, privileges: privilege_names } = props;

  await transact(opts.transaction).run(async (transaction) => {
    const existing_privileges = await recipient.getPrivileges({ transaction });

    const privileges: Privilege[] = await Privilege.findAll<Privilege>({
      where: { name: privilege_names },
      transaction,
    });
    const valid_names = privileges.map(item => item.name);
    const invalid_names = privilege_names.filter(privilege_name => !valid_names.includes(privilege_name));
    if (invalid_names.length)
      throw new BadRequestError(`invalid privilege`, { invalid_names });

    for (const privilege of existing_privileges) {
      if (!privilege_names.includes(privilege.name)) {
        privileges.push(privilege);
      }
    }
    await recipient.setPrivileges(privileges, { transaction });

    await SvLog.log_activity({
      category: Privilege.name,
      description: LogMessage.AddPrivileges,
      owner: recipient,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });
  });
};

/**
 * Retrieves all privileges where matches the updatable ids and of admin domain,
 * Filters through addable privileges,
 * Throws error for invalid privilege ids,
 * Adds valid new privileges and sets it to recipient specifically the admin
 * 
 * @param props - {@link UpdateAccountPrivilegeProps} Has recipient as Account object and privileges' id array
 * @param opts - {@link GenericOpts} Has transaction object that executes sync
 * 
 * @throws BadRequestError:invalid privilege ids - addable privilege ids are not valid
 */
export const update_admin_privilege = async (props: UpdatePrivilegeProps, opts: GenericOpts = {}) => {
  const { recipient, privileges: privilege_ids } = props;

  await transact(opts.transaction).run(async (transaction) => {
    const privileges: Privilege[] = await Privilege.findAll<Privilege>({
      where: {
        id: privilege_ids,
        domain: Privilege.Domain.Admin,
      },
      transaction,
    });

    const valid_ids = privileges.map(item => item.id);
    const invalid_ids = privilege_ids.filter(privilege_id => !valid_ids.includes(privilege_id));
    if (invalid_ids.length)
      throw new BadRequestError(`invalid privilege`, { invalid_ids });

    await recipient.setPrivileges(privileges, { transaction });

    await SvLog.log_activity({
      category: Privilege.name,
      description: LogMessage.UpdateAdminPrivilege,
      owner: recipient,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });
  });
};

/**
 * Retrieves all privileges where matches the updatable ids, are manageable and of manager domain,
 * Filters through addable privileges,
 * Throws error for invalid privilege ids,
 * Adds valid new privileges and sets it to the account
 * 
 * @param props - {@link UpdateAccountPrivilegeProps} Has `account` as Account object and privileges' id array
 * @param opts - {@link GenericOpts} Has transaction object that executes sync
 * 
 * @throws BadRequestError:invalid privilege ids - addable privilege ids are not valid
 */
export const update_account_privilege = async (props: UpdateAccountPrivilegeProps, opts: GenericOpts = {}) => {
  const { recipient, privileges: privilege_ids } = props;

  await transact(opts.transaction).run(async (transaction) => {
    const privileges: Privilege[] = await Privilege.findAll<Privilege>({
      where: {
        id: privilege_ids,
        domain: Privilege.Domain.Account,
      },
      transaction,
    });
    const valid_ids = privileges.map(item => item.id);
    const invalid_ids = privilege_ids.filter(privilege_id => !valid_ids.includes(privilege_id));
    if (invalid_ids.length)
      throw new BadRequestError(`invalid privilege`, { invalid_ids });

    await recipient.setPrivileges(privileges, { transaction });

    await SvLog.log_activity({
      category: Privilege.name,
      description: LogMessage.UpdateAccountPrivilege,
      owner: recipient,
      actor_id: props.actor_id,
      account_id: recipient.id,
      ip_address: opts.ip_address,
    }, { transaction });
  });
};

/**
 * Counts and checks if owner has global privileges
 * 
 * @param account - Owner obj 
 * @param privileges - List of privileges
 * @param opts - {@link GenericOpts} Has transaction object that executes sync
 * 
 * @returns num of global privileges 
 */
export const check_global_privilege = async (account: Account, privileges: string[], opts: GenericOpts = {}) => {
  const account_id = account.id;
  const privileged = await transact(opts.transaction).run(async (transaction) => {
    const count = await AccountPrivilege.count({
      where: { account_id },
      include: [{
        model: Privilege,
        where: {
          name: privileges,
        },
        required: true,
      }],
      transaction,
    });
    return count > 0;
  });
  return privileged;
};