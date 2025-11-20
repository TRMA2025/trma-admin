export function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}
export function convertToTitleCase(variableName) {
  // Replace underscores with spaces
  let formattedName = variableName ? variableName.replace(/_/g, " ") : "";
  formattedName = formattedName.replace(/-/g, " ");
  // Capitalize the first letter of each word
  formattedName = formattedName.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

  return formattedName;
}
