import { saveAs } from "file-saver";
import { baseUri, s3baseUrl } from "src/config/config";

/* Download a resource file from an admin list (16 Sep 2026).
 *
 * PDFs have been stored private since 13 Sep 2026, so fetching them from the
 * storage URL returns 403 - the admin Download icon silently failed on every
 * PDF. They go through the backend's authenticated download route instead,
 * which lets admin users through. Everything else is still public and is
 * fetched from storage as before.
 *
 * @param {string} path      storage key of the file
 * @param {string} pdfRoute  authenticated route for this resource type,
 *                           e.g. `/api/lesson_document/download/<slug>`
 * @param {string} title     used for the saved filename
 */
export const downloadResource = async ({ path, pdfRoute, title }) => {
  if (!path) throw new Error("This resource has no file attached");

  const isPdf = /\.pdf$/i.test(String(path).split("?")[0]);
  const response = isPdf
    ? await fetch(`${baseUri}${pdfRoute}`, {
        headers: { "x-sh-auth": localStorage.getItem("token") },
      })
    : await fetch(`${s3baseUrl}${path}`);

  if (!response.ok) {
    throw new Error(`Download failed (${response.status})`);
  }

  const blob = await response.blob();

  // The storage key is a UUID, so name the file after the resource instead.
  const ext = (String(path).split("?")[0].split(".").pop() || "").toLowerCase();
  const base =
    String(title || String(path).split("/").pop() || "download")
      .replace(/[\\/:*?"<>|]+/g, "_")
      .trim() || "download";
  const filename =
    ext && !base.toLowerCase().endsWith(`.${ext}`) ? `${base}.${ext}` : base;

  saveAs(blob, filename);
};

/* The bytes of a private PDF via its authenticated route, for the preview. */
export const fetchAuthenticatedPdf = async (pdfRoute) => {
  const response = await fetch(`${baseUri}${pdfRoute}`, {
    headers: { "x-sh-auth": localStorage.getItem("token") },
  });
  if (!response.ok) throw new Error(`Preview failed (${response.status})`);
  return response.blob();
};

export default downloadResource;
