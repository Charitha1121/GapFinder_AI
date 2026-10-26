import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export const runtime = 'nodejs';

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_PAGES = 250;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return Response.json({ error: 'Choose a PDF file to upload.' }, { status: 400 });
    }
    if (file.size === 0 || file.size > MAX_FILE_BYTES) {
      return Response.json({ error: 'PDF files must be between 1 byte and 15 MB.' }, { status: 413 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const signature = new TextDecoder().decode(bytes.subarray(0, 5));
    if (signature !== '%PDF-') {
      return Response.json({ error: 'The selected file is not a valid PDF.' }, { status: 415 });
    }

    const document = await getDocument({ data: bytes, useSystemFonts: true }).promise;
    if (document.numPages > MAX_PAGES) {
      await document.destroy();
      return Response.json({ error: 'PDF files are limited to 250 pages.' }, { status: 413 });
    }

    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .filter(Boolean)
        .join(' ')
        .trim();
      if (pageText) pages.push(`PAGE ${pageNumber}\n${pageText}`);
    }
    await document.destroy();

    const text = pages.join('\n\n').trim();
    if (!text) {
      return Response.json(
        { error: 'No selectable text was found. This PDF may be scanned; run OCR or paste its extracted text.' },
        { status: 422 }
      );
    }

    return Response.json({ title: file.name, content: text, pageCount: document.numPages });
  } catch (error) {
    console.error('PDF text extraction failed:', error);
    return Response.json({ error: 'Could not read this PDF. Try another file or paste its text.' }, { status: 422 });
  }
}