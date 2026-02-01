import { db } from '@/lib/db';

import { waitlist } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { z } from 'zod';


const waitlistSchema = z.object({
  email: z.email({ message: 'Invalid email address.' }),
  planTier: z.string().min(1, { message: 'Plan tier is required.' }),
  typeUser: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = waitlistSchema.parse(json);

    const newUser = await db
      .insert(waitlist)
      .values({
        email: body.email,
        planTier: body.planTier,
        typeUser: body.typeUser,
      })
      .returning();

    return NextResponse.json({
      user: newUser[0],
      message: 'Successfully signed up for the waitlist!',
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (error instanceof Error && 'code' in error && error.code === '23505') { // 23505 is Postgres code for unique_violation
        return NextResponse.json({ message: 'This email is already on the waitlist.' }, { status: 409 });
    }

    console.error('Waitlist API Error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
