// common business logic related util methods
import axios from "axios";
import { baseUri } from "../config/config";

axios.defaults.headers.post["Content-Type"] = "application/json";

const _url = "https://cors-anywhere.herokuapp.com/";

/* FormData bodies must not carry the global JSON Content-Type (15 Sep 2026).
 *
 * The default above applies to every POST. axios 0.24's transformRequest
 * (lib/defaults.js) hands FormData straight through WITHOUT clearing that
 * header, so the request went out labelled application/json with a multipart
 * body and no boundary. bodyParser.json() then threw and Express answered 400
 * with an HTML error page - which is why uploads and the password reset
 * appeared to do nothing.
 *
 * Deleting the key from the per-request headers is not enough: dispatchRequest
 * flattens config.headers.common and config.headers[method] over the top
 * afterwards, so the default would be merged back in. transformRequest runs
 * BEFORE that flatten and receives the unflattened headers object, so this is
 * the one place the default can be removed for a single request. With no
 * Content-Type set, the browser fills in multipart/form-data plus its
 * boundary, which is what the server needs.
 */
const IS_FORM_DATA = (value) =>
  typeof FormData !== "undefined" && value instanceof FormData;

const STRIP_CONTENT_TYPE = (headers) => {
  if (!headers) return;
  ["Content-Type", "content-type"].forEach((key) => {
    delete headers[key];
    if (headers.common) delete headers.common[key];
    if (headers.post) delete headers.post[key];
    if (headers.put) delete headers.put[key];
    if (headers.patch) delete headers.patch[key];
  });
};
export async function invokeApi({
  path,
  method = "GET",
  headers = {},
  queryParams = {},
  postData = {},
}) {
  const reqObj = {
    method,
    url: baseUri + path,
    headers,
  };

  reqObj.params = queryParams;

  if (method === "POST") {
    reqObj.data = postData;
  }
  if (method === "PUT") {
    reqObj.data = postData;
  }
  if (method === "DELETE") {
    reqObj.data = postData;
  }

  /* Applies to every method that carries a body, not just POST - an edit
     screen sending FormData over PUT hits the same problem. */
  if (IS_FORM_DATA(reqObj.data)) {
    reqObj.transformRequest = [
      function (data, requestHeaders) {
        STRIP_CONTENT_TYPE(requestHeaders);
        return data;
      },
    ];
  }

  let results;

  console.log("<===REQUEST-OBJECT===>", reqObj);

  try {
    results = await axios(reqObj);
    console.log("<===Api-Success-Result===>", results);

    return results?.data;
  } catch (error) {
    console.log("<===Api-Error===>", error.response?.data);

    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.reload();
    }
    /* Never return an empty message (15 Sep 2026). When the server answers
       with an HTML error page rather than JSON - as bodyParser does on a
       malformed body - error.response.data is a string with no .message, and
       the old code returned "" which surfaced as a blank toast, making the
       failure look like nothing happening at all. */
    const data = error.response?.data;
    const message =
      (data && typeof data === "object" && data.message) ||
      error.message ||
      "Something went wrong, please try again";
    return {
      code: error.response?.status || 0,
      message,
    };
  }
}
