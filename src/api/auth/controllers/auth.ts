/**
 * A set of functions called "actions" for `auth`
 */

import axios from "axios";
import * as jose from "jose";

export default {
  redirectWithIdToken: async (ctx, next) => {
    if (ctx.query.error && ctx.query.error === "access_denied")
      throw ctx.throw(401, "ClassLink authentication failed");

    const code = ctx.query.code;

    // Exchange code for ID token
    const response = await axios
      .post(
        strapi.config.auth.tokenEndpointUrl,
        {
          code: code,
          client_id: strapi.config.auth.clientId,
          client_secret: strapi.config.auth.clientSecret,
        },
        { headers: { "content-type": "application/x-www-form-urlencoded" } }
      )
      .catch((e) => {
        ctx.throw(e.response.status);
        return null;
      });

    const myInfo = await axios("https://nodeapi.classlink.com/v2/my/info", {
      headers: { Authorization: "Bearer " + response.data.access_token },
    });

    // Find the student corresponding to the given ClassLink ID
    const results = await strapi.entityService
      .findMany("api::student.student", {
        fields: ["id"],
        filters: { classLinkId: myInfo.data.SourcedId },
      })
      .catch(() => ctx.throw(500));

    // If no student matches, they must not have been
    /// imported into the portal for some reason
    if (results.length === 0) ctx.throw(401, "Student not registered");

    const studentId = results[0].id;

    // Return a JWS that will be used to authenticate
    // with our api by the front end
    const idToken = await new jose.SignJWT({ sub: studentId })
      .setProtectedHeader({ alg: strapi.config.auth.alg })
      .setIssuedAt()
      .setExpirationTime(strapi.config.auth.lifetime)
      .sign(await strapi.config.auth.secretKey)
      .catch(() => ctx.throw(500));

    // Redirect to the front end with the ID token
    ctx.redirect(strapi.config.auth.redirectUrl + `?idToken=${idToken}`);
  },
};
