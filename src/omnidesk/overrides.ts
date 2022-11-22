import { OmnideskUser } from "./types";

interface Override extends Partial<OmnideskUser> {
  user_id: number;
  user_screen_name: string;
}

/**
 * Overrides for Omnidesk users by manually inspecting the the database.
 * This is usually people who changed their Telegram aliases **after** contacting the bot for the first time.
 */
export const overrides: Override[] = [
  { user_id: 18397579, user_screen_name: "TheUltimateSurvivor" }, // Ayhem Bouabid
  { user_id: 25855385, user_screen_name: "GammaV" }, // Roukaya Mabrouk
  { user_id: 39015302, user_screen_name: "Eleutheromaniac_rabbit" }, // Ahmad Abid
  { user_id: 38882486, user_screen_name: "mostafakira" }, // Mostafa Kira
  { user_id: 12669968, user_screen_name: "mahmooddarwish" }, // Mahmood Darwish
  { user_id: 17572204, user_screen_name: "KamilSabbagh" }, // Kamil Sabbagh
  { user_id: 12788434, user_screen_name: "TasneemToolba" }, // Tasneem Toolba
  { user_id: 13573534, user_screen_name: "md_khalil" }, // Mohammad Khalil
  { user_id: 25721269, user_screen_name: "Ahmed_Alii7" }, // Ahmed Mohsen Ali
  { user_id: 22559400, user_screen_name: "palLink" }, // Sourabh Pal
  { user_id: 25827375, user_screen_name: "RamPrin" }, // Leonid Zelenskiy
  { user_id: 23857561, user_screen_name: "Leon_Parepko" }, // Leon Parepko
  { user_id: 38209603, user_screen_name: "Leflop_James" }, // Marat Akhmetov
  { user_id: 39895873, user_screen_name: "Suleiman_Karim" }, // Suleiman Karim
  { user_id: 18383039, user_screen_name: "majednaser" }, // Majed Naser
  { user_id: 18051595, user_screen_name: "MPardis" }, // Nikita Noskov
  { user_id: 17964534, user_screen_name: "HShohjahon" }, // Shokhjakhon Khamrakulov
  { user_id: 13909059, user_screen_name: "ease_l" }, // Arina Drenyassova
  { user_id: 12563760, user_screen_name: "eyihluyc" }, // Violetta Sim
  { user_id: 13279216, user_screen_name: "dionyusus" }, // Dias Usenov
  { user_id: 12734174, user_screen_name: "ElDakroury" }, // Karim ElDakroury
  { user_id: 8770606, user_screen_name: "ceevarouqa" }, // Selina Varouqa
  { user_id: 3144713, user_screen_name: "batanony" }, // Ahmed ElBatanony
  { user_id: 24383076, user_screen_name: "alisher_arystay" }, // Alisher Arystay
  { user_id: 25618470, user_screen_name: "alijnadi" }, // Ali Jnadi
  { user_id: 9472824, user_screen_name: "novarlic" }, // Nikola Novarlić
  { user_id: 3882735, user_screen_name: "Robertkai" }, // Roberto Chaves
  { user_id: 13619164, user_screen_name: "aamhmdi" }, // Ali Akbar
  { user_id: 24513830, user_screen_name: "YarikaAA" }, // Arina Yartseva
  { user_id: 18051612, user_screen_name: "qt_z1k0" }, // Zeiin Kanabekov
  { user_id: 18346128, user_screen_name: "qwerty9493" }, // Davlat Magzumov
].map((o) => ({ ...o, user_screen_name: o.user_screen_name.toLowerCase() }));
