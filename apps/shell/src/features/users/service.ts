import { apiGet, toDate } from "@/lib/server-api";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "ADMIN" | "ACCOUNTANT" | "VIEWER";
  status: "ACTIVE" | "INACTIVE";
  createdAt?: Date;
};

type RawUser = Omit<User, "createdAt"> & { createdAt?: unknown };

export async function listUsers() {
  const users = await apiGet<RawUser[]>("users");

  return users.map((user) => ({
    ...user,
    createdAt: toDate(user.createdAt) ?? undefined,
  }));
}
