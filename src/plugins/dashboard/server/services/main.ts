import { Strapi } from "@strapi/strapi";
import axios from "axios";

export default ({ strapi }: { strapi: Strapi }) => ({
  async importStudents() {
    const res = await axios(
      `https://oneroster-proxy.classlink.io/${strapi.config.auth.rosterApplicationId}/ims/oneroster/v1p1/students?limit=-1`,
      {
        headers: {
          Authorization: `Bearer ${strapi.config.auth.rosterAccessToken}`,
        },
      }
    );
    for (const student of res.data.users) {
      strapi.entityService
        .findMany("api::student.student", {
          fields: ["id"],
          filters: { classLinkId: student.sourcedId },
        })
        .then((results) => {
          // If no student already exists with this ID in ClassLink,
          // then create the student.
          if (results.length === 0) {
            strapi.entityService.create("api::student.student", {
              data: {
                givenName: student.givenName,
                familyName: student.familyName,
                classLinkId: student.sourcedId,
              },
            });
          }
        });
    }
  },
  async deleteStudentsAndApplications() {
    deleteAll("api::application.application");
    deleteAll("api::student.student");
  },
});

/**
 * Delete all entries with strapi uid `uid`
 * @param uid The strapi uid of the entry type
 * being targeted.
 * @example deleteAll('api::article.article')
 */
async function deleteAll(uid: string): Promise<void> {
  const entries = await strapi.entityService.findMany(uid, {
    fields: ["id"],
  });

  for (const entry of entries) {
    strapi.entityService.delete(uid, entry.id);
  }
}
