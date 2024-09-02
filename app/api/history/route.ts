import { NextRequest, NextResponse } from 'next/server';
import { db } from 'lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  const metadataCollectionRef = collection(db, 'uploads_metadata');
  const metadataSnapshot = await getDocs(metadataCollectionRef);
  const collections = metadataSnapshot.docs.map(doc => doc.data().collectionId);

  return NextResponse.json({ collections });
}
