import { useUser } from "@/components/UserContext";
import { Role } from "../generated/prisma/client";
import { useCallback, useMemo } from "react";
import { getAccessForPath } from "./AccessUtils";

export function getUserAccess(role: Role, path: string): string[] {
  try {
    const permissions: { path: string; access: string[] }[] = JSON.parse(
      role.permission || "[]",
    );

    return getAccessForPath(permissions, path);
  } catch {
    return [];
  }
}
export function hasAccess(role: Role, path: string, action: string): boolean {
  return getUserAccess(role, path).includes(action);
}

// export function useAccess(path: string) {
//   const user = useUser();
//   const role = user?.Role ?? null;

//   const access = useMemo(() => {
//     if (!role) return [];
//     return getUserAccess(role, path);
//   }, [role, path]);

//   const hasAccess = useMemo(
//     () => (action: string) => access.includes(action),
//     [access],
//   );
//   const crossAccess = useMemo(
//     // eslint-disable-next-line react-hooks/preserve-manual-memoization
//     () => (action: string, currPath: string) => {
//       const currAccess = getUserAccess(role!, currPath);
//       return currAccess.includes(action);
//     },
//     [access],
//   );

//   return { access, hasAccess, crossAccess };
// }

export function useAccess(path: string) {
  const user = useUser();
  const role = user?.Role ?? null;

  // 1. Tetap gunakan useMemo untuk nilai array
  const access = useMemo(() => {
    if (!role) return [];
    return getUserAccess(role, path);
  }, [role, path]);

  // 2. Gunakan useCallback untuk fungsi hasAccess
  const hasAccess = useCallback(
    (action: string) => access.includes(action),
    [access],
  );

  // 3. Gunakan useCallback, perbaiki dependency, dan buat lebih aman
  const crossAccess = useCallback(
    (action: string, currPath: string) => {
      if (!role) return false; // Jauh lebih aman daripada menggunakan role!

      const currAccess = getUserAccess(role, currPath);
      return currAccess.includes(action);
    },
    [role], // Dependency yang benar adalah role, bukan access
  );

  return { access, hasAccess, crossAccess };
}
