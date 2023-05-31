/**
 * Rename the keys of `obj` by replacing each key in `objq
 * with the corresponding renamed key found in `nameMap` and
 * keeping the values the same.
 * @param obj Any string-keyed object
 * @param nameMap A map keyed by keys of `obj` with values
 * denoting what each key should be renamed to. A value of `null`
 * says to remove the key from `obj`. Providing a
 * `nameMap` where some of the values are the same or are the
 * names of existing keys in `obj` may result in unexpected behavior.
 */
export function renameKeys(
  obj: Record<string, any>,
  nameMap: Record<string, string | null>
) {
  const newObj = structuredClone(obj);
  for (const [oldKeyName, newKeyName] of Object.entries(nameMap)) {
    const value = newObj[oldKeyName];
    delete newObj[oldKeyName];
    if (newKeyName !== null) {
      newObj[newKeyName] = value;
    }
  }
  return newObj;
}
