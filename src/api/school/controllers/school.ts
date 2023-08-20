export default {
  async findMany(ctx) {
    return await strapi.entityService.findMany("api::school.school");
  },

  async findOne(ctx) {
    return await strapi.entityService.findOne(
      "api::school.school",
      ctx.request.params.id
    );
  },
};
