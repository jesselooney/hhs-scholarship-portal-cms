export default {
  async findMany(ctx) {
    const sub = ctx.jwt.payload.sub;

    // Students can only view their own applications.
    return await strapi.entityService.findMany("api::application.application", {
      filters: {
        student: { id: sub },
      },
      populate: ["scholarship"],
    });
  },

  async findOne(ctx) {
    return await strapi.service("api::application.application").get(ctx);
  },

  async create(ctx) {
    const { essay, completed, scholarshipId } = ctx?.request?.body?.data;

    if (
      (essay && typeof essay !== "string") ||
      (completed && typeof completed !== "boolean") ||
      typeof scholarshipId !== "number"
    )
      ctx.throw(400);

    const sub = ctx.jwt.payload.sub;
    const existingApplications = await strapi.entityService.findMany(
      "api::application.application",
      {
        filters: {
          scholarship: scholarshipId,
          student: sub,
        },
        populate: ["scholarship"],
      }
    );

    // Prevent the creation of more than one application between the same
    // student and scholarship.
    if (existingApplications.length > 0)
      ctx.throw(400, {
        message:
          "There is already an application to this scholarship by this student.",
        details: { existingApplication: existingApplications[0] },
      });

    const createdApplication = await strapi.entityService.create(
      "api::application.application",
      {
        data: {
          essay: essay ?? "",
          completed: completed ?? false,
          scholarship: { set: [scholarshipId] },
          student: { set: [sub] },
        },
        populate: ["scholarship"],
      }
    );

    ctx.response.status = 201;
    return createdApplication;
  },

  async update(ctx) {
    const { essay, completed } = ctx?.request?.body?.data;

    if (
      (essay && typeof essay !== "string") ||
      (completed && typeof completed !== "boolean")
    )
      ctx.throw(400);

    // Throws if client is not authorized to access this application.
    const oldApplication = await strapi
      .service("api::application.application")
      .get(ctx);

    const updatedApplication = await strapi.entityService.update(
      "api::application.application",
      ctx.request.params.id,
      {
        data: {
          essay: essay ?? oldApplication.essay,
          completed: completed ?? oldApplication.completed,
        },
        populate: ["scholarship"],
      }
    );

    return updatedApplication;
  },

  async delete(ctx) {
    // Throws if client is not authorized to access this application.
    await strapi.service("api::application.application").get(ctx);

    const deletedApplication = await strapi.entityService.delete(
      "api::application.application",
      ctx.request.params.id,
      {
        populate: ["scholarship"],
      }
    );

    return deletedApplication;
  },
};
