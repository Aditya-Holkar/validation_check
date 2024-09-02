export async function findDuplicates(
    newData: Record<string, any>[],
    masterData: Record<string, any>[]
  ): Promise<{ fileDuplicates: Record<string, any>[]; masterDuplicates: Record<string, any>[] }> {
    const seenInFile = new Set();
    const fileDuplicates: Record<string, any>[] = [];
    const masterDuplicates: Record<string, any>[] = [];
  
    // Find duplicates within the uploaded file
    newData.forEach((item) => {
      const key = JSON.stringify(item);
      if (seenInFile.has(key)) {
        fileDuplicates.push(item);
      } else {
        seenInFile.add(key);
      }
    });
  
    // Find duplicates between the uploaded file and the master collection
    newData.forEach((item) => {
      const key = JSON.stringify(item);
      if (masterData.some((masterItem) => JSON.stringify(masterItem) === key)) {
        masterDuplicates.push(item);
      }
    });
  
    console.log("File Duplicates:", fileDuplicates);
    console.log("Master Data Duplicates:", masterDuplicates);
  
    return { fileDuplicates, masterDuplicates };
  }
  