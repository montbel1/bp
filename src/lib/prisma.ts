// Temporary compatibility layer for Prisma to Supabase migration
// This file provides error messages for any remaining Prisma calls

const createPrismaProxy = () => {
  return new Proxy(
    {},
    {
      get(target, prop) {
        throw new Error(
          `Prisma has been replaced with Supabase. ` +
            `Attempted to access prisma.${String(prop)}. ` +
            `Please update this code to use the supabase client from './supabase' instead.`
        );
      },
    }
  );
};

export const prisma = createPrismaProxy() as any;

// Migration note:
// To migrate from Prisma to Supabase:
// 1. Replace: import { prisma } from './prisma'
//    With:    import { supabase } from './supabase'
// 2. Replace Prisma queries with Supabase queries:
//    - prisma.table.findMany() -> supabase.from('table').select()
//    - prisma.table.create() -> supabase.from('table').insert()
//    - prisma.table.update() -> supabase.from('table').update()
//    - prisma.table.delete() -> supabase.from('table').delete()
// 3. Update field names from camelCase to snake_case
//    - userId -> user_id
//    - createdAt -> created_at
//    - etc.
