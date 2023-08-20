export default {
  routes: [
    {
      method: "GET",
      path: "/applications",
      handler: "application.findMany",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/applications/:id",
      handler: "application.findOne",
      config: { auth: false },
    },
    {
      method: "POST",
      path: "/applications",
      handler: "application.create",
      config: { auth: false },
    },
    {
      method: "PATCH",
      path: "/applications/:id",
      handler: "application.update",
      config: { auth: false },
    },
    {
      method: "DELETE",
      path: "/applications/:id",
      handler: "application.delete",
      config: { auth: false },
    },
  ],
};
