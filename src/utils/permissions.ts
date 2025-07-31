export const hasPermission = (code: string): boolean => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  return permissions.includes(code);
};
