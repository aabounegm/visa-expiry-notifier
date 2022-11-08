import { OmnideskUser } from "./types";

export function removeDuplicates(users: OmnideskUser[]): OmnideskUser[] {
  const userNameCache: Record<string, number> = {};
  const tgIdCache: Record<string, number> = {};
  return users.filter((user, i, users) => {
    if (user.user_screen_name in userNameCache) {
      const idx = userNameCache[user.user_screen_name];
      if (users[idx].telegram_id !== user.telegram_id) {
        console.warn(`Duplicate telegram alias found:`, user, users[idx]);
      }
      return false;
    }
    userNameCache[user.user_screen_name] = i;

    if (user.telegram_id in tgIdCache) {
      const idx = tgIdCache[user.telegram_id];
      console.warn(`Duplicate telegram chat_id found:`, user, users[idx]);
      return false;
    }
    tgIdCache[user.telegram_id] = i;
    return true;
  });
}
