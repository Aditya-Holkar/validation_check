import { NextRequest, NextResponse } from 'next/server';
import { db } from 'lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export async function GET(req: NextRequest, { params }: { params: { collection: string } }) {
  const collectionRef = collection(db, params.collection);
  const snapshot = await getDocs(collectionRef);
  const data = snapshot.docs.map(doc => doc.data());

  return NextResponse.json({ data });
}
