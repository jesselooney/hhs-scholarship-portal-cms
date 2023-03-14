import utils from "@strapi/utils";
const { ApplicationError } = utils.errors;

export default {
  async beforeCreate(event) {
    const application = event.params.data;
    const scholarshipID = application.scholarship.connect[0]?.id;
    const studentID = application.student.connect[0]?.id;

    // Ensure application has both required relationships.
    // For some reason, Strapi doesn't let you make,
    // relations required, so we have to do this.
    if (scholarshipID === undefined) errorMissingRelation("scholarship");
    if (studentID === undefined) errorMissingRelation("student");

    await assertApplicationIsUnique(scholarshipID, studentID);
  },
  async beforeUpdate(event) {
    // Get old relationships in case they aren't updated.
    const applicationID = event.params.where.id;
    const application = await strapi.entityService.findOne(
      "api::application.application",
      applicationID,
      {
        populate: {
          scholarship: { fields: ["id"] },
          student: { fields: ["id"] },
        },
      }
    );
    const oldScholarshipID = application.scholarship.id;
    const oldStudentID = application.student.id;

    // Get updated relationships; might be undefined.
    const applicationUpdate = event.params.data;
    // Ensure application has both required relationships.
    // For some reason, Strapi doesn't let you make,
    // relations required, so we have to do this.
    assertUpdatePreservesRelations(applicationUpdate);
    const newScholarshipID = applicationUpdate.scholarship.connect[0]?.id;
    const newStudentID = applicationUpdate.student.connect[0]?.id;

    // Resolve relationships so we have the newest of each ID,
    // whether it was updated this time or not.
    const scholarshipID = newScholarshipID ?? oldScholarshipID;
    const studentID = newStudentID ?? oldStudentID;

    await assertApplicationIsUnique(scholarshipID, studentID);
  },
};

/**
 * Ensure there is at most one application per student-scholarship pair
 * @param application The event application object
 */
async function assertApplicationIsUnique(
  scholarshipID: number,
  studentID: number
) {
  // Existing applications from the same student to the same scholarship
  const existingApplications = await strapi.entityService.findMany(
    "api::application.application",
    {
      filters: {
        scholarship: scholarshipID,
        student: studentID,
      },
      populate: {
        scholarship: {
          fields: ["name"],
        },
        student: {
          fields: ["firstName", "lastName"],
        },
      },
    }
  );

  if (existingApplications.length >= 1) {
    // There is at least 1 existing application with the same relations.
    const scholarshipName = existingApplications[0].scholarship.name;
    const studentName =
      existingApplications[0].student.firstName +
      " " +
      existingApplications[0].student.lastName;

    throw new ApplicationError(
      `Student '${studentName}' already has an application for scholarship '${scholarshipName}'`
    );
  }
}

/**
 * Ensure that both relations (scholarship and student) will be present
 * after the update, i.e. that they aren't removed without being replaced.
 * @param applicationUpdate The application update event parameter.
 */
function assertUpdatePreservesRelations(applicationUpdate) {
  assertUpdatePreservesRelation(applicationUpdate.scholarship, "scholarship");
  assertUpdatePreservesRelation(applicationUpdate.student, "student");
}

/**
 * Ensure that a relation is preserved, i.e. that it isn't
 * removed without being replaced.
 * @param relationUpdate A Strapi relation update object.
 */
function assertUpdatePreservesRelation(relationUpdate, relationName: string) {
  if (
    relationUpdate.connect.length === 0 &&
    relationUpdate.disconnect.length >= 1
  )
    // A relation was disconnected and nothing was connected to replace it.
    errorMissingRelation(relationName);
}

function errorMissingRelation(relationName: string) {
  throw new ApplicationError(`Missing relation: '${relationName}'`);
}
