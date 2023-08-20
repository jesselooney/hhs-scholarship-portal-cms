import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  async importStudents(ctx) {
    ctx.body = await strapi
      .plugin("dashboard")
      .service("main")
      .importStudents();
  },
  async deleteStudentsAndApplications(ctx) {
    ctx.body = await strapi
      .plugin("dashboard")
      .service("main")
      .deleteStudentsAndApplications();
  },
});
