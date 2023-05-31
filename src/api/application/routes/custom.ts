export default {
  routes: [
    {
      method: "GET",
      path: "/applications",
      handler: "application.myApplications",
    },
    {
      method: "GET",
      path: "/applications/:id",
      handler: "application.myApplication",
      config: {
        policies: ["does-own-application"],
      },
    },
  ],
};
