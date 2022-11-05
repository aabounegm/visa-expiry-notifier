interface OmnideskUserBase {
  user_id: number;
  user_full_name: string;
  confirmed: boolean;
  active: boolean;
  deleted: boolean;
  created_at: string;
  updated_at: string;
  language_id: number;
  // and some other irrelevant fields
}

interface OmnideskTelegramUser extends OmnideskUserBase {
  /** Not including the `@` symbol */
  user_screen_name: string;
  telegram_id: string;
  type: "telegram";
}

// We don't care about other user types for now
export type OmnideskUser = OmnideskTelegramUser;
