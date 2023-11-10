/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.createTable("movies_download_links", (table) => {
    table.string("id");
    table.string("movie_slug").unique();
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
export const down = async (knex) => {
  await knex.schema.dropTable("movies_download_links");
};
