import { z } from "zod/v4";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["client", "contractor"]),
  specialties: z.array(z.string()),
});

export type User = z.infer<typeof userSchema>;

const users = [
  {
    id: "d22f302e-4231-466b-a0f7-dd75c4920869",
    name: "Client",
    email: "hylandersimon@gmail.com",
    role: "client",
    specialties: [],
  },
  {
    id: "7b0bda3c-0a0b-4498-8eed-810262f56d98",
    name: "Roofing Contractor",
    email: "hylandersimon@gmail.com",
    role: "contractor",
    specialties: ["roofing"],
  },
];

export async function getUsers() {
  const { success, data } = await z.array(userSchema).safeParseAsync(users);

  if (!success) {
    throw new Error("Invalid users");
  }

  return data;
}

export async function getUserById(id: string) {
  const user = users.find((user) => user.id === id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
