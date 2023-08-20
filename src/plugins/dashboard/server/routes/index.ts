export default [
  {
    type: "admin",
    method: "POST",
    path: "/import-students",
    handler: "main.importStudents",
    config: {
      policies: [],
    },
  },
  {
    type: "admin",
    method: "DELETE",
    path: "/delete-students-and-applications",
    handler: "main.deleteStudentsAndApplications",
    config: {
      policies: [],
    },
  },
];
