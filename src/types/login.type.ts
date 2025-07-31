export type LoginResponse = {
  tokenCreate: {
    token: string | null;
    user: {
      email: string;
      isStaff: boolean;
      userPermissions: Array<{
        code: string;
      }>;
    } | null;
    errors: Array<{
      field: string | null;
      message: string;
    }>;
  };
};
