export type Mask = Record<string, boolean>;

/**
 * Use a mask to eliminate certain keys in an object.
 * @param obj An arbitrary string-keyed record.
 * @param mask A string-boolean record where a true value
 * says to include the corresponding key in `obj` and a false
 * value says to exclude the corresponding key.
 * @returns A new string-keyed record whose only keys are the
 * keys associated with true values in `mask`.
 */
export function applyMask(
  obj: Record<string, any>,
  mask: Mask
): Record<string, any> {
  let newObj: Record<string, any> = {};
  for (const [key, isEnabled] of Object.entries(mask)) {
    if (isEnabled) newObj[key] = obj[key];
  }
  return newObj;
}

/**
 * Create a mask from the top-level structure of an object.
 * @param obj An arbitrary string-keyed record.
 * @returns A mask where each key of `obj` is associated
 * with a true value so that `applyMask(obj, computeMask(obj)) === obj`.
 */
export function computeMask(flatData: Record<string, any>): Mask {
  return Object.fromEntries(
    Object.keys(flatData).map((fieldName) => [fieldName, true])
  );
}