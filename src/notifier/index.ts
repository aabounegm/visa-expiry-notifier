import { getAllExpiringDocs } from "../sheets/api";
import { DAYS_TO_VISA_EXPIRY, DAYS_TO_REGISTRATION_EXPIRY } from "../db/utils";
import { sequelize, User } from "../db";
import { expiringRegistrationMessage, expiringVisaMessage, katyaNotification } from "./messages";
import { User as SheetUser } from "../sheets/user";
import { Op } from "sequelize";

async function getStudentsForDoc(users: SheetUser[], type: "visa" | "registration") {
  const days = type === "visa" ? DAYS_TO_VISA_EXPIRY : DAYS_TO_REGISTRATION_EXPIRY;
  // Those are supposed to get notified and haven't been recently notified
  const unnotified = await User.findAll({
    where: {
      telegramUsername: users
        .filter(({ telegram }) => telegram !== "")
        .map((user) => user.telegram),
      [`${type}LastNotified`]: {
        [Op.or]: {
          [Op.is]: null,
          [Op.lt]: sequelize.literal(`DATE(${type}Expiration, '-${days} days')`),
        },
      },
      [`${type}Expiration`]: {
        [Op.ne]: "Invalid date",
      },
    },
  });
  const notified = await User.findAll({
    where: {
      [`${type}LastNotified`]: {
        [Op.gte]: sequelize.literal(`DATE(${type}Expiration, '-${days} days')`),
      },
    },
  });
  // Those are supposed to get notified but haven't been found in the database
  const notFound = users.filter((visa) => {
    const dbUser = unnotified.find((student) => student.telegramUsername === visa.telegram);
    const alreadyNotified =
      notified.find((student) => student.telegramUsername === visa.telegram) != undefined;
    return !alreadyNotified && dbUser?.telegramChatId == null;
  });
  return {
    unnotified: unnotified.filter((student) => student.telegramChatId != null),
    notFound,
  };
}

async function getStudentsToBeNotified() {
  const { expiringRegistrations, expiringVisas } = await getAllExpiringDocs();

  const { notFound: notFoundVisa, unnotified: unnotifiedStudentsVisa } = await getStudentsForDoc(
    expiringVisas,
    "visa"
  );
  const { notFound: notFoundRegistration, unnotified: unnotifiedStudentsRegistration } =
    await getStudentsForDoc(expiringRegistrations, "registration");

  return {
    unnotifiedStudentsVisa,
    notFoundVisa,
    // If visa and registration expire on the same day, don't notify about registration.
    unnotifiedStudentsRegistration: unnotifiedStudentsRegistration.filter(
      (user) => user.visaExpiration?.valueOf() !== user.registrationExpiration?.valueOf()
    ),
    notFoundRegistration,
  };
}

export enum NotificationType {
  VISA = "visa",
  REGISTRATION = "registration",
}

interface Message {
  chat_id: number;
  username: string;
  message: string;
  type: NotificationType;
}

export const katyaChatId = 1914456547;

export async function getPendingMesages(): Promise<Message[]> {
  const {
    notFoundRegistration,
    notFoundVisa,
    unnotifiedStudentsRegistration,
    unnotifiedStudentsVisa,
  } = await getStudentsToBeNotified();

  console.log("Students to be notified about visa:", unnotifiedStudentsVisa.length);
  console.log("Students to be notified about registration:", unnotifiedStudentsRegistration.length);
  console.log("Students not found in database:", notFoundVisa.length + notFoundRegistration.length);
  const messages: Message[] = [];
  messages.push(
    ...unnotifiedStudentsRegistration.map((student) => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        chat_id: student.telegramChatId!,
        username: student.telegramUsername,
        message: expiringRegistrationMessage,
        type: NotificationType.REGISTRATION,
      };
    })
  );
  messages.push(
    ...unnotifiedStudentsVisa.map((student) => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        chat_id: student.telegramChatId!,
        username: student.telegramUsername,
        message: expiringVisaMessage,
        type: NotificationType.VISA,
      };
    })
  );
  messages.push(
    ...notFoundRegistration.map((student) => {
      return {
        chat_id: katyaChatId,
        username: student.telegram,
        message: katyaNotification(student, "registration"),
        type: NotificationType.REGISTRATION,
      };
    })
  );
  messages.push(
    ...notFoundVisa.map((student) => {
      return {
        chat_id: katyaChatId,
        username: student.telegram,
        message: katyaNotification(student, "visa"),
        type: NotificationType.VISA,
      };
    })
  );

  return messages;
}

export async function updateLastNotified(username: string, type: NotificationType) {
  if (!username) return;
  const [affectedCount] = await User.update(
    type == NotificationType.REGISTRATION
      ? { registrationLastNotified: new Date() }
      : { visaLastNotified: new Date() },
    {
      where: {
        telegramUsername: username,
      },
    }
  );
  if (affectedCount === 0) {
    console.log("No user found with alias:", username);
  }
}
