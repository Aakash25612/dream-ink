

## Switch from Referral Link to Referral Code

### Overview
Replace the current referral link system with a short, shareable referral code. Each user gets a unique code (e.g., `CRT-A1B2C3`). New users can optionally enter a referral code during signup. When they do, the code owner gets +2 image credits.

### Changes Required

### 1. Database Migration
- Add a `referral_code` column to the `profiles` table (unique, not null, with a default generated code)
- Backfill existing users with generated codes
- Add a unique index on `referral_code`
- Update the `handle_new_user()` trigger function to:
  - Generate a unique referral code for new users (format: `CRT-` + 6 random alphanumeric chars)
  - Accept `referral_code` from `raw_app_meta_data` instead of `referrer_id`
  - Look up the referrer by their code, then call `complete_referral()`
- Add an RLS policy allowing anyone to look up a profile by referral code (SELECT on `referral_code` column only, for code validation)

### 2. Auth Page (`src/pages/Auth.tsx`)
- Add an optional "Referral Code" input field below the email field (visible before OTP stage)
- Store the entered code in state
- Pass the code as `referral_code` in `options.data` when calling `signInWithOtp()` (instead of `referrer_id`)
- Remove the `?ref=` URL parameter logic entirely

### 3. Referral Page (`src/pages/Referral.tsx`)
- Replace the referral link display with the user's referral code
- Fetch the code from the `profiles` table
- Update the share/copy button to share the code text instead of a URL
- Update the share message (e.g., "Use my Cretera code: CRT-A1B2C3")
- Update "How It Works" steps to reference the code instead of a link

### 4. Home Page (`src/pages/Home.tsx`)
- Remove any `?ref=` URL parameter handling if present

### Technical Details

**Referral Code Format**: `CRT-` followed by 6 uppercase alphanumeric characters (e.g., `CRT-X7K2M9`). Generated via a PL/pgSQL function to ensure uniqueness.

**Database function for code generation**:
```sql
CREATE FUNCTION generate_referral_code() RETURNS text AS $$
DECLARE
  code text;
  exists_already boolean;
BEGIN
  LOOP
    code := 'CRT-' || upper(substr(md5(random()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = code) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;
```

**Updated `handle_new_user()` trigger**: Will check for `referral_code` in `raw_app_meta_data`, look up the referrer's `user_id` from `profiles` where `referral_code` matches, then call `complete_referral()`.

**RLS consideration**: A new SELECT policy on `profiles` will allow unauthenticated lookups by `referral_code` only (to validate the code during signup). This is safe since it only exposes whether a code exists, not user data.

