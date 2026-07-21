export interface IAccessPermission {
  path: string;
  access: string[];
}

export function getAccessForPath(
  permissions: IAccessPermission[] | null | undefined,
  path: string,
): string[] {
  const normalizedPath = path === "/" ? "/" : path.replace(/\/+$/, "") || "/";
  const candidates = new Set<string>();

  let current = normalizedPath;
  while (true) {
    candidates.add(current);

    if (current === "/") {
      break;
    }

    const lastSlash = current.lastIndexOf("/");
    if (lastSlash <= 0) {
      current = "/";
      continue;
    }

    current = current.slice(0, lastSlash) || "/";
  }

  for (const candidate of candidates) {
    const found = permissions?.find((permission) => permission.path === candidate);
    if (found) {
      return found.access;
    }
  }

  return [];
}

export function hasAccessForPath(
  permissions: IAccessPermission[] | null | undefined,
  path: string,
  action: string,
): boolean {
  return getAccessForPath(permissions, path).includes(action);
}
