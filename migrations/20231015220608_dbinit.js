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
    table.string("poster").defaultTo(null);
    // constraints
    table.primary("id");
  });

  await knex.schema.createTable("movies_download_links", (table) => {
    table.string("id");
    table.string("movie_slug").unique();
    table.string("movie_link");
    table.json("download_links");
    table.datetime("created");

    // constraints
    table.primary("id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  await knex.schema.dropTable("movies");
  await knex.schema.dropTable("movies_download_links");
};
