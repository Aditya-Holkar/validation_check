'use client';

import React, { useState, useEffect } from 'react';

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [selectedData, setSelectedData] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    fetch('/api/history')
      .then((response) => response.json())
      .then((data) => setHistory(data.collections));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    setFile(null);
    fetch('/api/history')
      .then((response) => response.json())
      .then((data) => setHistory(data.collections));
  };

  const handleReset = () => {
    setFile(null);
    setSelectedData([]);
  };

  const handleViewData = async (collection: string) => {
    const response = await fetch(`/api/history/${collection}`);
    const result = await response.json();
    setSelectedData(result.data);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>Upload</button>
      <button onClick={handleReset}>Reset</button>

      <h2>History</h2>
      <ul>
        {history.map((collection) => (
          <li key={collection} onClick={() => handleViewData(collection)}>
            {collection}
          </li>
        ))}
      </ul>

      {selectedData.length > 0 && (
        <div>
          <h3>Data from selected collection</h3>
          <pre>{JSON.stringify(selectedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
