import { DAYS_TO_REGISTRATION_EXPIRY, DAYS_TO_VISA_EXPIRY } from "../db/utils";
import type { User } from "./user";

export function isVisaAboutToExpire({ visaExpiry }: User) {
  const today = new Date();
  // If expiry date is invalid (e.g. "безвизовый"), the NaN will cause the function to return false
  const diff = visaExpiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  return diffDays <= DAYS_TO_VISA_EXPIRY;
}

export function isRegistrationAboutToExpire({ registrationExpiry }: User) {
  const today = new Date();
  const diff = registrationExpiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  return diffDays <= DAYS_TO_REGISTRATION_EXPIRY;
}
