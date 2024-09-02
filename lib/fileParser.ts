import { read, utils } from 'xlsx';

export async function parseFile(file: Blob): Promise<Record<string, any>[]> {
  const arrayBuffer = await file.arrayBuffer();
  const fileType = file.type;

  if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return parseExcel(arrayBuffer);
  } else if (fileType === 'text/csv') {
    return parseCSV(arrayBuffer);
  } else if (fileType === 'text/plain') {
    return parseText(arrayBuffer);
  } else {
    throw new Error('Unsupported file type');
  }
}

function parseExcel(arrayBuffer: ArrayBuffer): Record<string, any>[] {
  const workbook = read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return utils.sheet_to_json(worksheet);
}

function parseCSV(arrayBuffer: ArrayBuffer): Record<string, any>[] {
  const text = new TextDecoder().decode(arrayBuffer);
  return csvToJson(text);
}

function parseText(arrayBuffer: ArrayBuffer): Record<string, any>[] {
  const text = new TextDecoder().decode(arrayBuffer);
  return textToJson(text);
}

function csvToJson(csv: string): Record<string, any>[] {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const data = line.split(',');
    const result: Record<string, any> = {};
    headers.forEach((header, index) => {
      result[header.trim()] = data[index].trim();
    });
    return result;
  });
}

function textToJson(text: string): Record<string, any>[] {
  const lines = text.split('\n');
  const result: Record<string, any>[] = [];
  lines.forEach(line => {
    const data = line.trim().split(/\s+/); // Assuming space-separated values
    if (data.length > 1) {
      result.push({ name: data[0], email: data[1] }); // Adjust fields according to your text format
    }
  });
  return result;
}
