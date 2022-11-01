import type { StudyYear } from "./sheets-service";

export interface User {
  name: string;
  email: string;
  telegram: string;
  registrationExpiry: Date;
  visaExpiry: Date;
  year: StudyYear;
}
