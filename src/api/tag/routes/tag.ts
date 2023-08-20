export default {
  routes: [
    {
      method: "GET",
      path: "/tags",
      handler: "tag.findMany",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/tags/:id",
      handler: "tag.findOne",
      config: { auth: false },
    },
  ],
};
