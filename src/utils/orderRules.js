/* Order number rules for lessons, Getting Started sessions, resources and
   stages (9 Oct 2026).

   - Order numbers may repeat within a list (KS1 Lesson 1 and KS2 Lesson 1).
   - Order is a whole number of 1 or more.
   - Changing the order asks first.
   - A repeat only warns when the other item shares a stage tag with this one.
     An untagged item sits in the All list with everything, so it shares
     with everything. */

const toStages = (value) => {
  if (Array.isArray(value)) {
    return value.filter((s) => typeof s === "string" && s.trim() !== "");
  }
  if (typeof value === "string" && value.trim() !== "") return [value];
  return [];
};

// The stage tags two items have in common, or null when they share none.
const sharedStages = (a, b) => {
  const left = toStages(a);
  const right = toStages(b);
  if (left.length === 0 && right.length === 0) return ["all stages (untagged)"];
  if (left.length === 0) return right;
  if (right.length === 0) return left;
  // Exact tags only, as the stage pills match (13 Oct 2026).
  const common = left.filter((s) => right.includes(s));
  return common.length > 0 ? common : null;
};

/* Programme slug of a lesson or Getting Started item whose programme was
   populated by the detail API. */
export const programSlugOf = (item) => {
  const program = Array.isArray(item?.program) ? item.program[0] : item?.program;
  return program?._id?.program_slug || program?.program_slug || "";
};

/* Fetch the other items in the same list, fresh, at submit time. Returns null
   when the list cannot be loaded, which skips the duplicate check. */
export const loadOrderSiblings = async (fetchList, listKey) => {
  try {
    const result = await fetchList();
    if (result?.code === 200 && Array.isArray(result[listKey])) {
      return result[listKey];
    }
  } catch (e) {}
  return null;
};

/* Run before saving. `from` is the order the item had when the form loaded,
   `to` the order being saved. `siblings` is the list the item sits in (array
   of { _id, order, ks_stages, title }), or null/[] to skip the duplicate
   check. `self` is { _id, ks_stages } with the tags being saved. Returns
   true to go ahead with the save. */
export const confirmOrderSave = ({ from, to, siblings, self, onError }) => {
  const text = String(to ?? "").trim();
  const next = Number(text);
  if (!/^\d+$/.test(text) || next < 1) {
    const message = "Order must be a whole number of 1 or more.";
    if (onError) onError(message);
    else window.alert(message);
    return false;
  }

  const hadOrder = from !== undefined && from !== null && String(from).trim() !== "";
  if (!hadOrder || Number(from) !== next) {
    const old = hadOrder ? from : "none";
    if (
      !window.confirm(`You are changing the order from ${old} to ${next}. Continue?`)
    ) {
      return false;
    }
  }

  if (!Array.isArray(siblings) || siblings.length === 0) return true;

  const stages = [];
  const titles = [];
  siblings.forEach((item) => {
    if (!item || (self?._id && String(item._id) === String(self._id))) return;
    if (Number(item.order) !== next) return;
    const common = sharedStages(self?.ks_stages, item.ks_stages);
    if (!common) return;
    common.forEach((s) => {
      if (!stages.includes(s)) stages.push(s);
    });
    titles.push(item.title || item.name || "Untitled");
  });
  if (titles.length === 0) return true;

  return window.confirm(
    `Another item in this list is also order ${next} and shares the stage tag(s) ${stages.join(
      ", "
    )}: ${titles.join(", ")}. Save anyway?`
  );
};
