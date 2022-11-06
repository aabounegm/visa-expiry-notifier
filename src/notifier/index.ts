import { getAllExpiringDocs } from "../sheets/api";
import { DAYS_TO_VISA_EXPIRY } from "../db/utils";
import { User } from "../db";
import { expiringRegistrationMessage, expiringVisaMessage, dariaNotification } from "./messages";

async function getStudentsToBeNotified() {
  const { expiringRegistrations, expiringVisas } = await getAllExpiringDocs();
  const studentsVisa = await User.findAll({
    where: {
      telegramUsername: expiringVisas.map((visa) => visa.telegram),
    },
  });
  const notFoundVisa = expiringVisas.filter(
    (visa) =>
      studentsVisa.find((student) => student.telegramUsername === visa.telegram) === undefined
  );

  const unnotifiedStudentsVisa = studentsVisa.filter(({ visaExpiration, visaLastNotified }) => {
    if (visaLastNotified == null) return true;
    if (visaExpiration == null) return false;
    const notifiedRecently =
      visaLastNotified.getTime() >=
      visaExpiration.getTime() - DAYS_TO_VISA_EXPIRY * 24 * 3600 * 1000;
    return !notifiedRecently;
  });
  // Repeat same procedure for registration
  // TODO: cleanup and refactor
  const studentsRegistration = await User.findAll({
    where: {
      telegramUsername: expiringRegistrations.map((visa) => visa.telegram),
    },
  });
  const notFoundRegistration = expiringRegistrations.filter(
    (registration) =>
      studentsVisa.find((student) => student.telegramUsername === registration.telegram) ===
      undefined
  );

  const unnotifiedStudentsRegistration = studentsRegistration.filter(
    ({ registrationExpiration, registrationLastNotified }) => {
      if (registrationLastNotified == null) return true;
      if (registrationExpiration == null) return false;
      const notifiedRecently =
        registrationLastNotified.getTime() >=
        registrationExpiration.getTime() - DAYS_TO_VISA_EXPIRY * 24 * 3600 * 1000;
      return !notifiedRecently;
    }
  );
  return {
    unnotifiedStudentsVisa,
    notFoundVisa,
    unnotifiedStudentsRegistration,
    notFoundRegistration,
  };
}

interface Message {
  chat_id: number;
  message: string;
}

const dariaChatId = 621181493; // Actually @aabounegm's for now

export async function getPendingMesages(): Promise<Message[]> {
  const {
    notFoundRegistration,
    notFoundVisa,
    unnotifiedStudentsRegistration,
    unnotifiedStudentsVisa,
  } = await getStudentsToBeNotified();

  const messages: Message[] = [];
  messages.push(
    ...unnotifiedStudentsRegistration.map((student) => {
      return {
        chat_id: student.telegramChatId,
        message: expiringRegistrationMessage,
      };
    })
  );
  messages.push(
    ...unnotifiedStudentsVisa.map((student) => {
      return {
        chat_id: student.telegramChatId,
        message: expiringVisaMessage,
      };
    })
  );
  messages.push(
    ...notFoundRegistration.map((student) => {
      return {
        chat_id: dariaChatId,
        message: dariaNotification(student, "registration"),
      };
    })
  );
  messages.push(
    ...notFoundVisa.map((student) => {
      return {
        chat_id: dariaChatId,
        message: dariaNotification(student, "visa"),
      };
    })
  );

  return messages;
}
