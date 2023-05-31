/**
 * is-same-student policy
 */

export default async (policyContext, config, { strapi }) => {
  const sub = policyContext.jwt.payload.sub;

  // Allow the request only if the targeted student is the same
  // as the one issuing the request.
  if (policyContext.params.id === String(sub)) return true;

  return false;
};
