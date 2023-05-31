/**
 * does-own-application policy
 */

export default async (policyContext, config, { strapi }) => {
  const sub = policyContext.jwt.payload.sub;

  const targetedEntry = await strapi.entityService.findOne(
    "api::application.application",
    policyContext.params.id,
    {
      populate: ["student"],
    }
  );

  if (!targetedEntry) return false;

  // Allow the request only if the targeted entry is owned by
  // the student issuing the request.
  if (targetedEntry.student.id === sub) return true;

  return false;
};
