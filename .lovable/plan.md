

## Show Referral Code Only for New Users

### Problem
The referral code input currently appears for all users on the sign-in screen. It should only be shown to new users during signup, since existing users don't need it.

### Solution
Since Supabase OTP uses the same flow for sign-in and sign-up, we need to check whether the email belongs to an existing user before showing the referral code field.

**Approach**: After the user enters their email and before sending the OTP, we query the `profiles` table to check if a profile exists for that email. If no profile is found, we show the referral code field as a second step before sending the code.

### Implementation

**File: `src/pages/Auth.tsx`**

1. Add a new state `isNewUser` (initially `null` -- unknown)
2. When the user submits their email:
   - First, check if a user with that email already exists by looking up profiles via Supabase auth admin or by attempting a lightweight check
   - Since we can't query auth.users from the client, we'll use a simpler UX: add a "Have a referral code?" toggle link that only shows a collapsible referral code input. This way existing users can ignore it, and new users can optionally expand it
3. Alternatively (simpler and better UX): Replace the always-visible referral code input with a small "Have a referral code?" text button that expands to show the input when tapped. This keeps the sign-in screen clean for returning users while still being accessible for new signups.

### Recommended Approach: Collapsible Referral Code

- Remove the always-visible referral code input
- Add a subtle "Have a referral code?" text link below the email field
- Tapping it reveals the referral code input with a smooth animation
- This keeps the screen clean for returning users (majority of visits) while still accessible for new users

### Changes to `src/pages/Auth.tsx`:
- Add `showReferralInput` boolean state (default: `false`)
- Replace the referral code input div with a toggle button + conditionally rendered input
- Keep all existing referral code logic (passing it to `signInWithOtp`) unchanged

