/**
 * `customAuth` middleware
 *
 * Block all requests to the api unless they have
 * a valid JWT identifying them.
 */

import { Strapi } from "@strapi/strapi";
import * as jose from "jose";

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    if (
      ctx.request.url.startsWith("/api") &&
      !ctx.request.url.startsWith("/api/auth")
    ) {
      try {
        const idToken = ctx.request.query.idToken;

        const decodedJwt = await jose.jwtVerify(
          idToken,
          await strapi.config.auth.secretKey
        );

        ctx.jwt = decodedJwt;
      } catch {
        ctx.throw(401);
      }
    }

    await next();
  };
};
