import { NextRequest, NextResponse } from 'next/server';
import { parseFile } from 'lib/fileParser';
import { db } from 'lib/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get('file') as Blob;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const parsedData = await parseFile(file);
  const timestamp = new Date().toISOString();

  // Store the new file data in the master collection
  const masterCollectionRef = collection(db, 'master');
  await addDoc(masterCollectionRef, {
    timestamp,
    data: parsedData,
  });

  // Store the new file data in a separate collection
  const fileCollectionRef = collection(db, `uploads_${timestamp}`);
  for (const entry of parsedData) {
    await addDoc(fileCollectionRef, entry);
  }

  // Store metadata in a 'uploads_metadata' collection
  const metadataCollectionRef = collection(db, 'uploads_metadata');
  await addDoc(metadataCollectionRef, {
    collectionId: `uploads_${timestamp}`,
    timestamp,
  });

  return NextResponse.json({ message: 'File uploaded successfully' });
}
