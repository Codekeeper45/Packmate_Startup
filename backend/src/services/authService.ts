/**
 * Google OAuth Service
 * Exchanges authorization code for tokens, fetches user info, and
 * upserts the User record in the database.
 */
import axios from 'axios';
import { prisma } from '../lib/prisma';
import { GoogleUserInfo } from '../types';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

export async function exchangeCodeForUser(code: string): Promise<{
  id: string;
  email: string;
  name: string;
  avatar: string | null;
}> {
  // 1. Exchange code → access token
  const tokenResponse = await axios.post<{
    access_token: string;
    id_token: string;
  }>(GOOGLE_TOKEN_URL, {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  });

  const { access_token } = tokenResponse.data;

  // 2. Fetch Google profile
  const userInfoResponse = await axios.get<GoogleUserInfo>(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const { sub: googleId, email, name, picture } = userInfoResponse.data;

  // 3. Upsert user
  const user = await prisma.user.upsert({
    where: { googleId },
    update: { name, avatar: picture ?? null },
    create: { googleId, email, name, avatar: picture ?? null },
    select: { id: true, email: true, name: true, avatar: true },
  });

  return user;
}

/**
 * Builds the Google OAuth authorization URL to redirect the browser to.
 */
export function getGoogleAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
