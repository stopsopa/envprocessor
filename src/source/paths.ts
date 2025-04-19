import path from "path";

const root = path.dirname(__filename);

export function getRootDirname(): string {
  return root;
}
