export type PrivilegeSpec = {
  domain: "admin";
  type: "role";
  label: string;
  manageable: boolean;
  description?: string;
};
export type PrivilegeMap = {
  [index: string]: PrivilegeSpec;
};

export const PrivilegeNames = {
  KidztimeSuperAdmin: "kidztime.superadmin",
  KidztimeGenericAdmin: "kidztime.genericadmin",
};

export const Privileges: PrivilegeMap = {
  [PrivilegeNames.KidztimeSuperAdmin]: {
    domain: "admin",
    type: "role",
    label: "Kidztime Super Admin",
    manageable: false,
    description: "System-wide unlimited access."
  },
  [PrivilegeNames.KidztimeGenericAdmin]: {
    domain: "admin",
    type: "role",
    label: "Kidztime Generic Admin",
    manageable: false,
    description: "Generic admin access."
  },
};