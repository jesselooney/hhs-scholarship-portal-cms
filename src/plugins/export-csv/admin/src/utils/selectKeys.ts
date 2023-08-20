/**
 * Filter an object to keep only certain keys.
 * @param obj The object to filter properties on
 * @param keys The keys to keep in the final object
 * @returns The original object stripped of all properties except those with names in the `keys` array
 */
export function selectKeys(obj: Object, keys: readonly PropertyKey[]): Object {
  return Object.fromEntries(
    keys
      .filter((key) => key in obj)
      // @ts-ignore, because obj[key] is guaranteed
      // to be safe by the line above.
      .map((key) => [key, obj[key]])
  );
}
