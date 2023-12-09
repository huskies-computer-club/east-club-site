/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("order_items", (table) => {
    table.increments("order_item_id");
    table
      .integer("order_id")
      .references("order_id")
      .inTable("orders")
      .onDelete("cascade")
      .onUpdate("cascade")
      .unsigned();
    table
      .integer("item_id")
      .references("item_id")
      .inTable("items")
      .onDelete("cascade")
      .onUpdate("cascade")
      .unsigned();
    table.integer("quantity").unsigned();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("order_items");
};
