/**
 * school router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::school.school", {
  only: ["find", "findOne"],
  config: {},
});
