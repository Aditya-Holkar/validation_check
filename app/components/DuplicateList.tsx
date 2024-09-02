'use client';

import React from 'react';

interface DuplicateListProps {
  fileDuplicates: Record<string, any>[];
  masterDuplicates: Record<string, any>[];
}

export default function DuplicateList({ fileDuplicates, masterDuplicates }: DuplicateListProps) {
  return (
    <div>
      <h2>File Duplicates</h2>
      <ul>
        {fileDuplicates.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
      <h2>Master Data Duplicates</h2>
      <ul>
        {masterDuplicates.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}
