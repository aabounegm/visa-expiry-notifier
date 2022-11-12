import type { StudyYear } from "./api";

export interface User {
  name: string;
  email: string;
  telegram: string;
  registrationExpiry: Date;
  visaExpiry: Date;
  year: StudyYear;
}
