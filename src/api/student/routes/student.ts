/**
 * student router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::student.student", {
  only: ["findOne", "update"],
  config: {
    findOne: { policies: ["is-same-student"] },
    update: { policies: ["is-same-student"] },
  },
});
