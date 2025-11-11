import { env } from "~/env";

export const headers = () => ({
  Authorization: `Bearer ${env.PROPOSALES_API_KEY}`,
});
