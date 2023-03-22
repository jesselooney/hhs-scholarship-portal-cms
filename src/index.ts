export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap(/*{ strapi }*/) {
    await ensureConfigurationExists();
  },
};

/**
 * Create a default configuration object if one
 * does not already exist. This should only run
 * the first time the server starts after a fresh
 * install.
 */
async function ensureConfigurationExists() {
  const existingConfigurations: unknown = await strapi.entityService.findMany(
    "api::configuration.configuration",
    { fields: ["id"] }
  );

  if (!existingConfigurations) {
    console.log("No existing configuration; creating one:");
    const newConfiguration = await strapi.entityService.create(
      "api::configuration.configuration",
      {
        data: {
          accessDurationStart: new Date().toISOString().slice(0, 10),
          accessDurationEnd: new Date().toISOString().slice(0, 10),
        },
      }
    );
    console.log(newConfiguration);
  }
}
