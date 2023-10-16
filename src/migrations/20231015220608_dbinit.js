/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const up = async function (knex) {
  await knex.schema.createTable("movies", (table) => {
    table.string("id");
    table.string("title");
    table.text("description");
    table.string("link");
    table.string("source");
    table.dateTime("created");

    // constraints
    table.primary("id");
  });

  await knex.schema.createTable("crawler_settings", (table) => {
    table.string("field");
    table.string("value");
    table.datetime("updated");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  await knex.schema.dropTable("movies");
  await knex.schema.dropTable("crawler_settings");
};
