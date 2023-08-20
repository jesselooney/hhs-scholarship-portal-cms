export default {
  routes: [
    {
      method: "GET",
      path: "/scholarships",
      handler: "scholarship.findMany",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/scholarships/:id",
      handler: "scholarship.findOne",
      config: { auth: false },
    },
  ],
};
