/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  await knex.schema.createTable("config", (table) => {
    table.string("field");
    table.json("value");
  });
  await knex
    .table("config")
    .insert({ field: "last_crawled_movie", value: null });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  await knex.schema.dropTable("config");
};
