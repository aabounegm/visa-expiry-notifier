import { GoogleSpreadsheet } from "google-spreadsheet";
import {
  isRegistrationAboutToExpire,
  isVisaAboutToExpire,
  isMedicalAboutToExpire,
} from "./date-utils";
import type { User } from "./user";

const SHEET_ID = "1vFmDJTnQdkkcU6XESmMHKzmKdXSSoyJ-VVZ5cENzE6s";

const doc = new GoogleSpreadsheet(SHEET_ID);

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
  MEDICAL_EXPIRY = "Медосмотр до",
}

interface ExpiringDocs {
  expiringVisas: User[];
  expiringRegistrations: User[];
  expiringMedical: User[];
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
    medicalExpiry: getDateFromField(row[Fields.MEDICAL_EXPIRY]),
    year: sheet,
  }));
}

export async function getAllExpiringDocs(): Promise<ExpiringDocs> {
  const users = await getAllStudents();
  const expiringVisas = users.filter(isVisaAboutToExpire);
  const expiringRegistrations = users.filter(isRegistrationAboutToExpire);
  const expiringMedical = users.filter(isMedicalAboutToExpire);
  return { expiringVisas, expiringRegistrations, expiringMedical };
}

export async function getAllStudents(): Promise<User[]> {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string,
    private_key: process.env.GOOGLE_PRIVATE_KEY as string,
  });
  await doc.loadInfo();
  const sheetNames = Object.values(StudyYear);
  const allStudents = await Promise.all(sheetNames.map(getStudentsInSheet));
  return allStudents.flat().map((u) => ({ ...u, telegram: u.telegram.toLowerCase() }));
}
