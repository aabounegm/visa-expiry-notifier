import { GoogleSpreadsheet } from "google-spreadsheet";
import { isVisaAboutToExpire } from "./date-utils";
import type { User } from "./user";

const SHEET_ID = "1K2US-p5tnt4kL1TK6_FsIBliioUjO3L8Y5_OhMQ7jfc";

const doc = new GoogleSpreadsheet(SHEET_ID);
doc.useApiKey(process.env.SHEETS_API_KEY as string);

export enum StudyYear {
  BACHELOR_1 = "БАК_1 курс",
  BACHELOR_2 = "БАК_2 курс",
  BACHELOR_3 = "БАК_3 курс",
  BACHELOR_4 = "БАК_4 курс",
  MASTERS_1 = "МАГ_1 курс",
  MASTERS_2 = "МАГ_2 курс",
  PHD = "АСПЫ",
}

enum Fields {
  NAME = "ФИО (как в паспорте / визе)",
  EMAIL = "Почта",
  TELEGRAM = "Телеграмм",
  REGISTRATION_EXPIRY = "Регистрация до",
  VISA_EXPIRY = "Виза до",
}

interface ExpiringDocs {
  expiringVisas: Omit<User, "registrationExpiry">[];
  expiringRegistrations: Omit<User, "visaExpiry">[];
}

const dateRegex = /(\d{1,2})\.(\d{1,2})\.(\d{4})/;
function getDateFromField(field: string) {
  if (dateRegex.test(field)) {
    const [day, month, year] = field.split(".");
    return new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
  }
  return new Date(NaN);
}

async function getStudentsInSheet(sheet: StudyYear) {
  const rows = await doc.sheetsByTitle[sheet].getRows();
  return rows.map((row: Record<string, string>) => ({
    name: row[Fields.NAME],
    email: row[Fields.EMAIL],
    telegram: row[Fields.TELEGRAM]?.replace("@", "") ?? "",
    registrationExpiry: getDateFromField(row[Fields.REGISTRATION_EXPIRY]),
    visaExpiry: getDateFromField(row[Fields.VISA_EXPIRY]),
    year: sheet,
  }));
}

export async function getExpiringDocsForClass(sheet: StudyYear): Promise<ExpiringDocs> {
  const users = await getStudentsInSheet(sheet);
  const expiringVisas = users.filter(isVisaAboutToExpire);
  const expiringRegistrations = users.filter(isVisaAboutToExpire);
  return { expiringVisas, expiringRegistrations };
}

export async function getAllExpiringDocs(): Promise<ExpiringDocs> {
  await doc.loadInfo();
  const sheetNames = Object.values(StudyYear);
  const allExpiring = await Promise.all(sheetNames.map(getExpiringDocsForClass));
  const expiringVisas = allExpiring.map((expiring) => expiring.expiringVisas).flat();
  const expiringRegistrations = allExpiring
    .map((expiring) => expiring.expiringRegistrations)
    .flat();
  return { expiringVisas, expiringRegistrations };
}

export async function getAllStudents(): Promise<User[]> {
  await doc.loadInfo();
  const sheetNames = Object.values(StudyYear);
  const allStudents = await Promise.all(sheetNames.map(getStudentsInSheet));
  return allStudents.flat();
}
