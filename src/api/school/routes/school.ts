/**
 * school router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::school.school", {
  only: ["find", "findOne"],
  config: { find: { auth: false }, findOne: { auth: false } },
});
