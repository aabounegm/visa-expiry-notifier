import type { User } from "../sheets/user";

export const expiringVisaMessage = `Your *visa* is about to expire soon\\. Please bring the following documents to 319 office as soon as possible to prolong it:
\\- Passport \\(original\\)
\\- Copy of all nonempty pages of your passport
\\- The payment receipt for the visa prolongation
\\- One 3x4 cm photo
\\- The current registration card and a copy of it
\\- The current migration card and a copy of it

Failure to provide the documents on time can result in deportation\\!

P\\.S\\.: This is an automated message\\. Do not reply to this message\\. If you already brought the documents, you can ignore this message\\.`;

export const expiringRegistrationMessage = `Your *registration card* is about to expire soon\\. Please send the following documents to the bot \\(or bring them to 319 office\\) as soon as possible to prolong it: 
\\- Copy of all pages of your passport \\(including empty ones\\) 
\\- The current registration card and a copy of it
\\- The migration card 

Failure to provide the documents on time can result in paying a fine and being interrogated by the migration services\\. Two strikes in one year will result in deportation\\!

P\\.S\\.: This is an automated message\\. Do not reply to this message\\. If you already brought the documents, you can ignore this message\\.`;

export const expiringRegistrationForTemporaryResidency = `Your *registration as a temporary residence permit holder* is about to expire soon\\. We remind you that an annual notification to the migration service in Verkhny Uslon \\(the UFMS\\) should be submitted once a year: 
\\- Application of confirmation of residence 
\\- Passport
\\- Temporary residence permit document 

Failure to provide the documents on time can result in paying a fine and being interrogated by the migration services\\. Two strikes in one year will result in deportation and TRP\\'s cancellation\\! 
 
P\\.S\\.: This is an automated message\\. Do not reply to this message\\. If you already brought the documents, you can ignore this message\\.`;

function escapeSpecialChars(text: string) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

export function katyaNotification(user: User, documentType: string) {
  let studentName = user.name;
  // Usernames can have underscores, which are interpreted as Markdown formatting
  if (user.telegram !== "") studentName += ` (@${user.telegram})`;
  studentName = escapeSpecialChars(studentName);
  return `The student ${studentName} could not be reached about their expiring *${documentType}*\\.`;
}
