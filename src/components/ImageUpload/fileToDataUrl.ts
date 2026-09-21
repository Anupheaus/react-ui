/**
 * Default `onUpload` resolver for `ImageUpload`: reads a picked file and resolves
 * with a base64 `data:` URL. Used when no backend uploader is supplied, so the
 * component works standalone. FileReader is a genuinely fallible DOM boundary.
 */
export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error(`Failed to read file "${file.name}"`));
    reader.readAsDataURL(file);
  });
}
