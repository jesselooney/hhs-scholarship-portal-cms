export default {
  async findMany(ctx) {
    return await strapi.entityService.findMany("api::scholarship.scholarship", {
      populate: ["tags"],
    });
  },

  async findOne(ctx) {
    return await strapi.entityService.findOne(
      "api::scholarship.scholarship",
      ctx.request.params.id,
      {
        populate: ["tags"],
      }
    );
  },
};
