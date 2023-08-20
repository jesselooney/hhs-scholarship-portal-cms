export default {
  routes: [
    {
      method: "GET",
      path: "/schools",
      handler: "school.findMany",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/schools/:id",
      handler: "school.findOne",
      config: { auth: false },
    },
  ],
};
