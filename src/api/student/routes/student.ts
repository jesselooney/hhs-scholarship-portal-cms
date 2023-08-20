export default {
  routes: [
    {
      method: "GET",
      path: "/students/me",
      handler: "student.findMe",
      config: { auth: false },
    },
    {
      method: "PATCH",
      path: "/students/me",
      handler: "student.updateMe",
      config: { auth: false },
    },
  ],
};
