import type { User } from "../sheets/user";

export const expiringVisaMessage = `Your visa is about to expire soon\\. Please bring the following documents to 319 office as soon as possible to prolong it:
\\- Passport \\(original\\)
\\- Copy of all nonempty pages of your passport
\\- The payment receipt for the visa prolongation
\\- One 3x4 cm photo
\\- The current registration card and a copy of it
\\- The current migration card and a copy of it

Failure to provide the documents on time can result in deportation\\!

P\\.S\\.: This is an automated message\\. Do not reply to this message\\. If you already brought the documents, you can ignore this message\\.`;

export const expiringRegistrationMessage = `Your registration card is about to expire soon\\. Please bring the following documents to 319 office as soon as possible to prolong it:
\\- Copy of all nonempty pages of your passport
\\- The current registration card and a copy of it

Failure to provide the documents on time can result in paying a fine and being interrogated by the migration services\\. Two strikes in one year will result in deportation\\!

P\\.S\\.: This is an automated message\\. Do not reply to this message\\. If you already brought the documents, you can ignore this message\\.`;

export function dariaNotification(user: User, documentType: string) {
  let studentName = user.name;
  if (user.telegram !== "") studentName += ` (@${user.telegram})`;
  return `The student ${studentName} could not be reached about their expiring ${documentType}`;
}
