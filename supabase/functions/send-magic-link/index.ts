import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'https://esm.sh/resend@2.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

const createMagicLinkEmail = (token: string, supabase_url: string, email_action_type: string, redirect_to: string, token_hash: string) => {
  const magicLink = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0f; padding: 40px 12px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a2e; padding: 40px; border-radius: 8px; max-width: 100%;">
                <tr>
                  <td>
                    <h1 style="color: #89CFF0; font-size: 32px; font-weight: bold; margin: 0 0 20px; padding: 0;">Welcome to CRETERA</h1>
                    <p style="color: #e0e0e0; font-size: 14px; margin: 12px 0;">Click the button below to sign in to your account:</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                      <tr>
                        <td align="center">
                          <a href="${magicLink}" style="background-color: #4A90E2; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; text-align: center; display: inline-block; padding: 16px 32px; border-radius: 9999px; margin: 0;">Sign in to CRETERA</a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #e0e0e0; font-size: 14px; margin: 24px 0 12px;">Or, copy and paste this temporary login code:</p>
                    
                    <div style="background-color: #2a2a3e; border-radius: 5px; border: 1px solid #3a3a4e; padding: 16px; margin: 0;">
                      <code style="color: #89CFF0; font-family: monospace; font-size: 18px; font-weight: bold; letter-spacing: 2px; text-align: center; display: block;">${token}</code>
                    </div>
                    
                    <p style="color: #ababab; font-size: 14px; margin: 14px 0 16px;">If you didn't try to login, you can safely ignore this email.</p>
                    
                    <p style="color: #898989; font-size: 12px; line-height: 22px; margin: 32px 0 0; text-align: center;">CRETERA - Experience Infinite Imagination</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 })
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)
  const wh = new Webhook(hookSecret)
  
  try {
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
        token_new: string
        token_hash_new: string
      }
    }

    console.log('Sending magic link email to:', user.email)

    const html = createMagicLinkEmail(
      token,
      Deno.env.get('SUPABASE_URL') ?? '',
      email_action_type,
      redirect_to,
      token_hash
    );

    const { error } = await resend.emails.send({
      from: 'CRETERA <auth@auth.kreverk.com>',
      to: [user.email],
      subject: 'Sign in to CRETERA',
      html,
    })
    
    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Magic link email sent successfully')
  } catch (error) {
    console.error('Error in send-magic-link function:', error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: (error as any).code,
          message: (error as any).message || 'An error occurred',
        },
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  const responseHeaders = new Headers()
  responseHeaders.set('Content-Type', 'application/json')
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: responseHeaders,
  })
})
