

## Fix: Referral Code Not Showing

### Root Cause
The `profiles` table SELECT RLS policy ("Anyone can lookup referral codes") is set as **restrictive** (`Permissive: No`) instead of **permissive**. 

In PostgreSQL RLS, you need at least one **permissive** policy to allow access. Restrictive policies only further narrow access granted by permissive ones. Since there's no permissive SELECT policy on `profiles`, all SELECT queries return zero rows -- which is why the referral code appears empty.

### Fix
Run a database migration to:
1. Drop the current restrictive SELECT policy on `profiles`
2. Re-create it as a **permissive** policy

```sql
DROP POLICY IF EXISTS "Anyone can lookup referral codes" ON public.profiles;

CREATE POLICY "Anyone can lookup referral codes"
  ON public.profiles
  FOR SELECT
  USING (true);
```

This single change will fix the issue. No frontend code changes are needed since `Referral.tsx` already correctly fetches the code from the `profiles` table.
