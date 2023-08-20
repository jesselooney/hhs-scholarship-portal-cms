// @ts-nocheck
// https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-javascript-objects
export function flattenRecursive(data) {
  var result = {};
  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++)
        recurse(cur[i], prop + "[" + i + "]");
      if (l == 0) result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + "." + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
}

export function flattenByMainField(
  entry: Object,
  metadatas: Record<string, Metadata>,
  attributes: Record<string, Attribute>
) {
  return Object.fromEntries(
    Object.keys(entry).map((field) => {
      if (field in attributes && attributes[field].type === "relation") {
        return [field, entry[field][metadatas[field].list.mainField.name]];
      } else {
        return [field, entry[field]];
      }
    })
  );
}

interface Metadata {
  list: { mainField: { name: string } };
}

interface Attribute {
  type: string;
}
