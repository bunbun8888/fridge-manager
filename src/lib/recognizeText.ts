import Tesseract from 'tesseract.js';

export async function recognizeText(imageFile: File): Promise<string> {
  const { data: { text } } = await Tesseract.recognize(imageFile, 'jpn');
  return text;
}
