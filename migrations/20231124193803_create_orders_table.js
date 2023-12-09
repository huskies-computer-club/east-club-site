/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("orders", (table) => {
    table.increments("order_id");
    table
      .integer("user_id")
      .references("user_id")
      .inTable("users")
      .onDelete("cascade")
      .onUpdate("cascade")
      .unsigned();
    table
      .enu("status", ["pending", "complete", "cancelled"])
      .defaultTo("pending");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("orders");
};
