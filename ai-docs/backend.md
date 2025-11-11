# AI Docs: Backend

When creating backend endpoints for the client to consume, prefer using TRPC.

## Overview

This project uses [tRPC](https://trpc.io/) for type-safe API endpoints. tRPC provides end-to-end type safety between your backend and frontend without code generation.

## Architecture

- **Routers**: Defined in `~/server/api/routers/` - each router file exports a router with related procedures
- **Root Router**: `~/server/api/root.ts` - combines all routers into the main `appRouter`
- **tRPC Setup**: `~/server/api/trpc.ts` - contains context creation, middleware, and procedure helpers
- **API Route**: `~/app/api/trpc/[trpc]/route.ts` - Next.js API route handler for tRPC requests

## Creating a New Router

### Step 1: Create the Router File

Create a new file in `~/server/api/routers/` (e.g., `proposal-request-router.ts`):

```typescript
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const proposalRequestRouter = createTRPCRouter({
  // Your procedures go here
});
```

### Step 2: Define Procedures

Procedures are either **queries** (read operations) or **mutations** (write operations).

#### Mutation Example (from `proposal-request-router.ts`)

```typescript
export const proposalRequestRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // Access database via ctx.db
      // Perform your mutation logic
      console.log(input);
    }),
});
```

#### Query Example

```typescript
export const proposalRequestRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // Access database via ctx.db
    // Return data
    return ctx.db.select().from(posts);
  }),
  
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.select().from(posts).where(eq(posts.id, input.id));
    }),
});
```

### Step 3: Input Validation with Zod

Always validate inputs using Zod schemas:

```typescript
.input(z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
}))
```

Common Zod validators:
- `z.string()` - string type
- `z.string().min(n)` - minimum length
- `z.string().email()` - email format
- `z.number()` - number type
- `z.number().int()` - integer
- `z.boolean()` - boolean
- `z.array(z.string())` - array of strings
- `z.object({ ... })` - object with nested validation
- `z.optional()` - optional field
- `z.nullable()` - nullable field

### Step 4: Accessing Database

The database is available via `ctx.db`:

```typescript
.mutation(async ({ ctx, input }) => {
  // Insert example
  const result = await ctx.db.insert(posts).values({
    name: input.name,
  }).returning();
  
  // Update example
  await ctx.db.update(posts)
    .set({ name: input.name })
    .where(eq(posts.id, input.id));
  
  // Delete example
  await ctx.db.delete(posts)
    .where(eq(posts.id, input.id));
  
  return result;
})
```

### Step 5: Register Router in Root

Add your router to `~/server/api/root.ts`:

```typescript
import { proposalRequestRouter } from "~/server/api/routers/proposal-request-router";

export const appRouter = createTRPCRouter({
  proposalRequest: proposalRequestRouter,
  // Add more routers here
});
```

The router will be accessible as `api.proposalRequest.create()` on the frontend.

## Using tRPC from Frontend

### Setup

The tRPC client is already configured in `~/trpc/react.tsx`. Use the `api` export:

```typescript
import { api } from "~/trpc/react";
```

### Calling Mutations

```typescript
const createProposalRequest = api.proposalRequest.create.useMutation({
  onSuccess: (data) => {
    console.log("Success!", data);
  },
  onError: (error) => {
    console.error("Error:", error);
  },
});

// In your component
const handleSubmit = () => {
  createProposalRequest.mutate({
    name: "John Doe",
  });
};
```

### Calling Queries

```typescript
const { data, isLoading, error } = api.proposalRequest.getAll.useQuery();

// With input
const { data } = api.proposalRequest.getById.useQuery({ id: "123" });
```

### Using in Forms (TanStack Form)

```typescript
import { api } from "~/trpc/react";

const form = useForm({
  defaultValues: {
    name: "",
    email: "",
  },
  onSubmit: async ({ value }) => {
    await createProposalRequest.mutateAsync(value);
  },
});
```

## Procedure Types

### `publicProcedure`

Use for endpoints that don't require authentication:

```typescript
import { publicProcedure } from "~/server/api/trpc";

publicProcedure
  .input(z.object({ ... }))
  .mutation(async ({ ctx, input }) => { ... });
```

### Protected Procedures (Future)

When authentication is added, you can create protected procedures:

```typescript
// In trpc.ts
export const protectedProcedure = t.procedure.use(timingMiddleware).use(authMiddleware);

// In your router
import { protectedProcedure } from "~/server/api/trpc";

protectedProcedure
  .input(z.object({ ... }))
  .mutation(async ({ ctx, input }) => {
    // ctx.session is available here
  });
```

## Context

The context (`ctx`) is created in `~/server/api/trpc.ts` and includes:
- `db` - Database instance (Drizzle ORM)
- `headers` - Request headers

Access context in procedures:

```typescript
.mutation(async ({ ctx, input }) => {
  // ctx.db - database access
  // ctx.headers - request headers
});
```

## Best Practices

1. **One router per domain**: Group related procedures in the same router (e.g., `proposalRequestRouter` for all proposal request operations)

2. **Validate all inputs**: Always use Zod schemas for input validation

3. **Use appropriate procedure types**: 
   - `.query()` for read operations (GET-like)
   - `.mutation()` for write operations (POST/PUT/DELETE-like)

4. **Handle errors**: Return meaningful error messages or throw tRPC errors

5. **Type safety**: Let TypeScript infer types - tRPC provides full type safety automatically

6. **Naming conventions**:
   - Router files: `*-router.ts` (e.g., `proposal-request-router.ts`)
   - Router exports: `*Router` (e.g., `proposalRequestRouter`)
   - Procedures: use verbs (e.g., `create`, `getAll`, `update`, `delete`)

## Example: Complete Router Implementation

```typescript
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const proposalRequestRouter = createTRPCRouter({
  // Create a new proposal request
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email"),
      message: z.string().min(10, "Message must be at least 10 characters"),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(posts).values({
        name: input.name,
      }).returning();
      
      return result[0];
    }),

  // Get all proposal requests
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(posts);
  }),

  // Get a single proposal request by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);
      
      return result[0] ?? null;
    }),
});
```
