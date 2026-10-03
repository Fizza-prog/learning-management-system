/**
 * @file database.js
 * @description Configures the Sequelize connection to PostgreSQL.
 *
 * Responsibilities:
 * - Create the shared Sequelize instance from environment settings.
 * - Authenticate the connection and synchronize model definitions.
 */
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "127.0.0.1",
    dialect: "postgres",

    logging: false,

    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connected successfully");
  } catch (error) {
    console.error(
      "Database connection failed:",
      error.message
    );
  }
};

export { sequelize, connectDB };