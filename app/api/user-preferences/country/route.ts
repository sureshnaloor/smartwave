import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('smartwave');
    
    const userPreferences = await db.collection('userpreferences').findOne({
      email: session.user.email
    });

    return NextResponse.json({ country: userPreferences?.country || null });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { country } = await request.json();
    const client = await clientPromise;
    const db = client.db('smartwave');
    
    await db.collection('userpreferences').updateOne(
      { email: session.user.email },
      { 
        $set: { country },
        $setOnInsert: { email: session.user.email }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}