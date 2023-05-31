/**
 * application controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::application.application", {
  async myApplications(ctx) {
    const sub = ctx.jwt.payload.sub;

    // Students can only view their own applications.
    return await strapi.entityService.findMany("api::application.application", {
      filters: {
        student: { id: sub },
      },
      populate: ["student", "scholarship"],
    });
  },
  async myApplication(ctx) {
    return await strapi.entityService.findOne(
      "api::application.application",
      // @ts-ignore
      ctx.request.params.id,
      {
        populate: ["scholarship", "student"],
      }
    );
  },
});
