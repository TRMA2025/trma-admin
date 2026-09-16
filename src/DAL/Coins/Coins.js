import { invokeApi } from "../../bl_libs/invokeApi";
import { baseUri } from "../../config/config";

/* Coin reset log, admin side (15 Sep 2026).
 *
 * Read only - there is no admin route that edits or removes a reset record.
 * Both endpoints 404 while the backend's COINS_YEARS flag is off.
 */
export const ListCoinResets = async (query) => {
  const params = new URLSearchParams();
  if (query?.school) params.append("school", query.school);
  if (query?.academic_year) params.append("academic_year", query.academic_year);
  if (query?.scope) params.append("scope", query.scope);
  params.append("page", query?.page ?? 0);
  params.append("limit", query?.limit ?? 50);

  const requestObj = {
    path: `/api/coins/admin/resets?${params.toString()}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

/* The export streams a CSV, not JSON, so it goes through fetch directly and is
   saved as a blob - invokeApi would try to parse the body. */
export const ExportCoinResets = async (query) => {
  const params = new URLSearchParams();
  if (query?.school) params.append("school", query.school);
  if (query?.academic_year) params.append("academic_year", query.academic_year);
  if (query?.scope) params.append("scope", query.scope);

  const response = await fetch(
    `${baseUri}api/coins/admin/resets/export?${params.toString()}`,
    { headers: { "x-sh-auth": localStorage.getItem("token") } }
  );
  if (!response.ok) {
    throw new Error(`Export failed (${response.status})`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `coin_resets_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
