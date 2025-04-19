declare module "pdfjs-dist/legacy/build/pdf.js" {
  export * from "pdfjs-dist/types/src/pdf";
}

declare module "pdfjs-dist/build/pdf.js" {
  export * from "pdfjs-dist/types/src/pdf";
}

declare module "pdf-parse/lib/pdf-parse.js" {
  const pdfParse: (buffer: Buffer) => Promise<{
    text: string;
    info: object;
    metadata?: any;
    version?: string;
    numpages: number;
    numrender: number;
    outline?: any[];
    // Add more fields from pdf-parse result if needed
  }>;
  export default pdfParse;
}
