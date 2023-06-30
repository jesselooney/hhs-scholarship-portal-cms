/**
 * scholarship router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::scholarship.scholarship", {
  only: ["find", "findOne"],
  config: { find: { auth: false }, findOne: { auth: false } },
});
