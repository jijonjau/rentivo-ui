'use client';

import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RoleRequest } from '@/src/types/roles';
import { ReferenceDataService } from '@/src/services/ReferenceDataService';
import { AuthService } from '@/src/services/AuthService';
import DashboardHeader from '@/src/components/dashboard/ui/DashboardHeader';
import PageHeader from '@/src/components/shared/PageHeader';
import FormInput from '@/src/components/shared/FormInput';
import Dropdown from '@/src/components/shared/Dropdown';
import Button from '@/src/components/shared/Button';
import PermissionModal from '@/src/components/shared/PermissionModal';
import PageLoader from '@/src/components/shared/PageLoader';
import { useRouter } from 'next/navigation';

interface AddEditRoleProps {
  roleId?: number;
}

export default function AddEditRole({ roleId }: AddEditRoleProps) {
  const isEditMode = Boolean(roleId);
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isPermissionModal, setIsPermissionModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<RoleRequest>({
    defaultValues: {
      roleName: '',
      accountType: '',
      permissionIds: [],
    },
  });

  const selectedPermissions = useWatch({
    control,
    name: 'permissionIds',
  });

  // Fetch permissions
  const { data: permissionsResponse, isLoading: loadingPermissions } = useQuery(
    {
      queryKey: ['permissions'],
      queryFn: ReferenceDataService.FetchPermissions,
      // staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch account types
  const { data: accountTypesResponse, isLoading: loadingAccountTypes } =
    useQuery({
      queryKey: ['account-types'],
      queryFn: ReferenceDataService.FetchAccountTypes,
      // staleTime: 5 * 60 * 1000,
    });

  // Fetch existing role when editing
  const { data: roleResponse, isLoading: loadingRole } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => AuthService.FetchRoleById(roleId!),
    enabled: isEditMode,
  });

  const permissions = Array.isArray(permissionsResponse?.payload)
    ? permissionsResponse.payload
    : [];
  const accountTypes = Array.isArray(accountTypesResponse?.payload)
    ? accountTypesResponse.payload
    : [];
  const role = roleResponse?.payload;

  // Populate form when editing
  useEffect(() => {
    if (role) {
      reset({
        roleName: role.roleName,
        accountType: Number(role.accountType),
        permissionIds: role.permissionIds,
      });
    }
  }, [role, reset]);

  // Create role
  const createMutation = useMutation({
    mutationFn: AuthService.CreateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  // Update role
  const updateMutation = useMutation({
    mutationFn: (values: RoleRequest) =>
      AuthService.UpdateRole(roleId!, {
        roleName: values.roleName,
        accountType: Number(values.accountType),
        permissionIds: values.permissionIds,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', roleId] });
    },
  });

  const onSubmit = (values: RoleRequest) => {
    const payload = {
      roleName: values.roleName,
      accountType: Number(values.accountType),
      permissionIds: values.permissionIds,
    };

    if (isEditMode) {
      updateMutation.mutate(payload, {
        onSuccess: () => router.push('/dashboard/roles'),
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => router.push('/dashboard/roles'),
      });
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  if (loadingRole || loadingPermissions || loadingAccountTypes) {
    return <PageLoader />;
  }

  return (
    <>
      <DashboardHeader name="George Njau" role="Super Admin" />

      <div className="space-y-6 p-6">
        <PageHeader
          title={isEditMode ? 'Edit Role' : 'Add Role'}
          description="Configure role details and access permissions."
          showBackButton
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-xl border border-slate-200 bg-white p-6"
        >
          {/* Role details */}
          <div className="grid gap-5 sm:grid-cols-2">
            <FormInput
              label="Role Name"
              id="roleName"
              placeholder="e.g. Property Manager"
              error={errors.roleName?.message}
              {...register('roleName', {
                required: 'Role name is required',
                minLength: {
                  value: 3,
                  message: 'Role name must have at least 3 characters',
                },
              })}
            />

            <Controller
              name="accountType"
              control={control}
              rules={{ required: 'Account type is required' }}
              render={({ field }) => (
                <Dropdown
                  label="Account Type"
                  id="accountTypeId"
                  options={accountTypes}
                  value={String(field.value ?? '')}
                  onChange={(value) => field.onChange(Number(value))}
                  placeholder="Select account type"
                  error={errors.accountType?.message}
                />
              )}
            />
          </div>

          {/* Permissions */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  Role Permissions
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Configure what users assigned to this role can access.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPermissionModal(true)}
              >
                Configure Permissions
              </Button>
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Permissions selected
                </span>

                <span className="text-sm font-semibold text-blue-600">
                  {selectedPermissions.length} / {permissions.length}
                </span>
              </div>

              {selectedPermissions.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedPermissions.slice(0, 5).map((id) => {
                    const permission = permissions.find(
                      (item) => item.id === id
                    );

                    return permission ? (
                      <span
                        key={id}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                      >
                        {permission.name}
                      </span>
                    ) : null;
                  })}

                  {selectedPermissions.length > 5 && (
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                      +{selectedPermissions.length - 5} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  No permissions selected yet.
                </p>
              )}
            </div>

            {errors.permissionIds && (
              <p className="mt-2 text-sm text-red-600">
                {errors.permissionIds.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving
                ? 'Saving...'
                : isEditMode
                  ? 'Update Role'
                  : 'Create Role'}
            </Button>
          </div>
        </form>
      </div>

      {/* Permission selector */}
      {isPermissionModal && (
        <PermissionModal
          isOpen={isPermissionModal}
          onClose={() => setIsPermissionModal(false)}
          permissions={permissions}
          selectedIds={selectedPermissions}
          onApply={(ids) =>
            setValue('permissionIds', ids, { shouldValidate: true })
          }
        />
      )}
    </>
  );
}
