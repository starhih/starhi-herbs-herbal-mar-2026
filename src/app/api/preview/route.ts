import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const secret = searchParams.get('secret');

  if (secret && process.env.PAYLOAD_SECRET && secret !== process.env.PAYLOAD_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  if (url) {
    redirect(url);
  }

  redirect('/');
}
