/**
 * application service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::application.application",
  ({ strapi }) => ({
    async get(ctx) {
      const application = await strapi.entityService.findOne(
        "api::application.application",
        ctx.request.params.id,
        {
          populate: ["scholarship", "student"],
        }
      );

      if (application === null) ctx.throw(404);

      const subjectId = ctx.jwt.payload.sub;
      if (application.student.id !== subjectId) ctx.throw(401);

      delete application.student;
      return application;
    },
  })
);
