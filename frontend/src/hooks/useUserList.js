import { useMemo } from 'react';

export default function useUserList(users = [], currentUser = null) {
  return useMemo(() => {
    if (!Array.isArray(users)) return [];
    const nonManagers = users.filter((u) => (u.role || '').toLowerCase() !== 'manager');
    if (!currentUser?.department) return nonManagers;
    return nonManagers.filter((u) => (u.department || null) === currentUser.department);
  }, [users, currentUser]);
}
