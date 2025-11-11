import { redirect } from "next/navigation";
import { setAuthCookie } from "~/server/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response("Missing userId parameter", { status: 400 });
  }

  await setAuthCookie(userId);

  redirect("/");
}
