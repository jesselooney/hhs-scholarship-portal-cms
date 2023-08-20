/**
 * `accessDurationEnforcer` middleware
 * Blocks public api responses with 403 (Forbidden) error
 * when the configured application window has closed.
 */

import { Strapi } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    // Only operate on public `/api` route.
    if (ctx.request.url.startsWith("/api")) {
      // Other policies require that there be exactly one configuration,
      // so if this fails there are other problems anyway.
      // .findMany() doesn't wrap results in an array when
      // it is a single type, by the way.
      const { accessDurationStart, accessDurationEnd } =
        await strapi.entityService.findMany(
          "api::configuration.configuration",
          {
            fields: ["accessDurationStart", "accessDurationEnd"],
          }
        );

      const start = new Date(accessDurationStart);
      const end = new Date(accessDurationEnd);
      const today = new Date();

      if (today < start || end < today) {
        // today is out of allowed access duration,
        // so we should block the request
        return ctx.forbidden("The application window has closed.", {
          accessDurationStart,
          accessDurationEnd,
        });
      }
    }

    await next();
  };
};
