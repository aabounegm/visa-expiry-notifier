import { Sequelize } from "sequelize";
import { User, attributes as userAttributes } from "./user";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
  logging: false,
});

User.init(userAttributes, { sequelize });

// Note: this promise should be awaited, but we don't have top-level await yet.
// Let's just hope no race conditions happen.
void sequelize.sync();

export { User };
