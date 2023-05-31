/**
 * application router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::application.application", {
  except: ["find", "findOne"],
  config: {
    create: { policies: ["does-own-application"] },
    update: { policies: ["does-own-application"] },
    delete: { policies: ["does-own-application"] },
  },
});
