"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CONSTANTS } from "./data-access/proposales/constants";
import { getUsers } from "./data-access/user";

export async function auth() {
  const users = await getUsers();
  const cookieStore = await cookies();

  const userId = cookieStore.get(CONSTANTS.USER_ID_COOKIE_NAME)?.value;

  if (userId) {
    const user = users.find((user) => user.id === userId);

    if (user) {
      return {
        user,
      };
    }
  }

  return {
    user: null,
  };
}

export async function signInDefault() {
  const defaultUser = (await getUsers()).find((user) => user.role === "client");

  if (!defaultUser) {
    throw new Error("No default user found");
  }

  redirect(`/api/auth/set-cookie?userId=${defaultUser.id}`);
}

export async function setAuthCookie(userId: string) {
  const cookieStore = await cookies();

  cookieStore.set(CONSTANTS.USER_ID_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}
