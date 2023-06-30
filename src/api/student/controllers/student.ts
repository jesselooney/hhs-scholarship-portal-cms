export default {
  async findMe(ctx) {
    return await strapi.entityService.findOne(
      "api::student.student",
      ctx.jwt.payload.sub,
      {
        populate: "*",
      }
    );
  },
  async updateMe(ctx) {
    const updateData = ctx?.request?.body?.data;

    const allowedAttributes = [
      "prospectiveMajor",
      "prospectiveCollege",
      "communityActivitiesDescription",
      "jobsDescription",
      "schoolActivitiesDescription",
      "primarySchoolId",
      "elementarySchoolId",
      "middleSchoolId",
      "middleSchoolGraduatedFromId",
    ];

    // Blank out unallowed attributes.
    for (const attribute of Object.keys(updateData)) {
      if (!allowedAttributes.includes(attribute))
        updateData[attribute] = undefined;
    }

    await assertSchoolSelectionsAreValid(ctx, updateData);

    updateData.primarySchool = updateData.primarySchoolId;
    updateData.elementarySchool = updateData.elementarySchoolId;
    updateData.middleSchool = updateData.middleSchoolId;
    updateData.middleSchoolGraduatedFrom =
      updateData.middleSchoolGraduatedFromId;

    return await strapi
      .service("api::student.student")
      .update(ctx.jwt.payload.sub, {
        data: updateData,
        populate: "*",
      });
  },
};

async function assertSchoolSelectionsAreValid(ctx, studentData) {
  const schoolCategories: [string, number, number][] = [
    ["primarySchoolId", 0, 2],
    ["elementarySchoolId", 3, 4],
    ["middleSchoolId", 5, 8],
    ["middleSchoolGraduatedFromId", 8, 8],
  ];

  for (const category of schoolCategories) {
    await assertSchoolSelectionIsValid(ctx, studentData, category);
  }
}

async function assertSchoolSelectionIsValid(
  ctx,
  studentData,
  [categoryName, minGrade, maxGrade]: [string, number, number]
) {
  const schoolId = studentData[categoryName];

  // If no change is present, we are done.
  if (!schoolId) return;

  if (typeof schoolId !== "number")
    ctx.throw(400, `Attribute '${categoryName}' must be a number.`);

  const { name, lowestGradeServed, highestGradeServed } = await strapi.db
    .query("api::school.school")
    .findOne({
      select: ["name", "lowestGradeServed", "highestGradeServed"],
      where: { id: schoolId },
    });

  // As long as the grade range (minGrade, maxGrade) is included
  // in the grade range served by the school, we are in the clear.
  if (lowestGradeServed <= minGrade && maxGrade <= highestGradeServed) return;

  ctx.throw(400, {
    message: `Attribute '${categoryName}' must be in the interval [${lowestGradeServed}, ${highestGradeServed}]`,
    details: {
      selectedSchool: {
        id: schoolId,
        name,
        lowestGradeServed,
        highestGradeServed,
      },
    },
  });
}
