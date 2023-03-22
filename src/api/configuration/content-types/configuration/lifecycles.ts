import utils from "@strapi/utils";
const { ApplicationError } = utils.errors;

export default {
  async beforeUpdate(event) {
    assertValidAccessDuration(event.params.data);
  },
  async beforeDelete() {
    // BUG: this error message doesnt render
    throw new ApplicationError("The configuration cannot be deleted.");
  },
};

/**
 * Ensure that the end date comes after the start
 * date in the access duration configuration.
 */
function assertValidAccessDuration(configuration) {
  const startDate = new Date(configuration.accessDurationStart);
  const endDate = new Date(configuration.accessDurationEnd);
  if (startDate > endDate)
    throw new ApplicationError(
      "accessDurationStart cannot come after accessDurationEnd"
    );
}
