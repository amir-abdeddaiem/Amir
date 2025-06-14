declare module 'pdfkit' {
  class PDFDocument {
    constructor(options?: any);
    pipe(dest: any): this;
    on(event: string, callback: (chunk: Buffer) => void): this;
    end(): void;
    fontSize(size: number): this;
    fillColor(color: string): this;
    text(text: string, options?: any): this;
    moveDown(lines?: number): this;
  }
  export = PDFDocument;
} 