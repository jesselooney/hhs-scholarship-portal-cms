export default {
  async findMany(ctx) {
    return await strapi.entityService.findMany("api::tag.tag");
  },

  async findOne(ctx) {
    return await strapi.entityService.findOne(
      "api::tag.tag",
      ctx.request.params.id
    );
  },
};
