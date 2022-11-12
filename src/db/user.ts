import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  ModelAttributes,
  DataTypes,
} from "sequelize";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  /** As obtained from Omnidesk since Telegram will not receive any messages */
  declare fullName: string;
  /** Excluding the `@` prefix */
  declare telegramUsername: string;
  /** The `chat_id` used to send a message from the Telegram bot */
  declare telegramChatId: number | null;
  /** The last time this user has been notified about their expiring visa */
  declare visaLastNotified: Date | null;
  /** The last time this user has been notified about their expiring registration */
  declare registrationLastNotified: Date | null;
  /** The date when this user's visa expires */
  declare visaExpiration: Date | null;
  /** The date when this user's registration expires */
  declare registrationExpiration: Date | null;
}

export const attributes: ModelAttributes<User, InferAttributes<User>> = {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telegramUsername: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  telegramChatId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  visaLastNotified: {
    type: DataTypes.DATE,
  },
  registrationLastNotified: {
    type: DataTypes.DATE,
  },
  visaExpiration: {
    type: DataTypes.DATE,
  },
  registrationExpiration: {
    type: DataTypes.DATE,
  },
};
