import pdf from "pdf-parse/lib/pdf-parse.js"; // <- this is the magic import

export default async function parsePdfBuffer(buffer: Buffer) {
  const data = await pdf(buffer);
  return data.text; // or data.numpages, data.info etc.
}
