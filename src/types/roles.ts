export type RoleResponse = {
  id: number;
  roleName: string;
  accountType: string;
  permissionIds: number[];
  status: string;
  systemRole: boolean;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
};

export type RoleRequest = {
  roleName: string;
  accountType: number | '';
  permissionIds: number[];
};
