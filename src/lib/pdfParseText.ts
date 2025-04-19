process.env["PDFJS_DISABLE_FONT_FACE"] = "true";

import { getDocument } from "pdfjs-dist/build/pdf.js";
import type { PDFDocumentProxy } from "pdfjs-dist";

export default async function extractTextFromPDF(
  buffer: Buffer
): Promise<string> {
  const loadingTask = getDocument({ data: buffer });
  const pdf: PDFDocumentProxy = await loadingTask.promise;

  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(" ") + "\n";
  }

  return fullText;
}
