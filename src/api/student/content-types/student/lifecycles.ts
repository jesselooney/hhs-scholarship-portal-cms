import utils from "@strapi/utils";
const { ApplicationError } = utils.errors;

export default {
  async beforeCreate(event) {
    await assertSchoolSelectionsAreValid(event.params.data);
  },
  async beforeUpdate(event) {
    await assertSchoolSelectionsAreValid(event.params.data);
  },
};

async function assertSchoolSelectionsAreValid(student) {
  const schoolCategories: [string, number, number][] = [
    ["primarySchool", 0, 2],
    ["elementarySchool", 3, 4],
    ["middleSchool", 5, 8],
    ["middleSchoolGraduatedFrom", 8, 8],
  ];

  for (const category of schoolCategories) {
    await assertSchoolSelectionIsValid(student, category);
  }
}

async function assertSchoolSelectionIsValid(
  student,
  [categoryName, minGrade, maxGrade]: [string, number, number]
) {
  // Only one school can be connected at a time (or at all)
  // in a category, so we choose the only possible index.
  const connectedSchool = student[categoryName].connect[0];

  // If no school was connected in this query, our job is done.
  if (typeof connectedSchool === "undefined") return;

  const {
    name: schoolName,
    lowestGradeServed,
    highestGradeServed,
  } = await strapi.db.query("api::school.school").findOne({
    select: ["name", "lowestGradeServed", "highestGradeServed"],
    where: { id: connectedSchool.id },
  });

  // As long as the grade range (minGrade, maxGrade) is included
  // in the grade range served by the school, we are in the clear.
  if (lowestGradeServed <= minGrade && maxGrade <= highestGradeServed) return;

  // Otherwise, an invalid school has been selected.
  throw new ApplicationError(
    `Invalid ${categoryName} selection: ${schoolName}`
  );
}
