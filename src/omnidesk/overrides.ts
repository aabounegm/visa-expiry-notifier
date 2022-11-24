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
  { user_id: 18270417, user_screen_name: "hamody28522" }, // Mohamed Hamdy
  { user_id: 11823000, user_screen_name: "fluorescent_axolotl" }, // Du Tham Lieu
  { user_id: 13014410, user_screen_name: "Levalih" }, // Valihan Ilyasov
  { user_id: 18050641, user_screen_name: "Salloum_A" }, // Ali Salloum
  { user_id: 26037016, user_screen_name: "willithemenace" }, // Wilson Ogbona
  { user_id: 27871175, user_screen_name: "HAGMmX" }, // Naghmeh Mohammadifar
  { user_id: 12368150, user_screen_name: "Sh1co" }, // Sherif Nafee
  { user_id: 13322717, user_screen_name: "m_igorr" }, // Igor Mpore
  { user_id: 15351452, user_screen_name: "nurbak_zh" }, // Nurbek Zhomartov
  { user_id: 12556243, user_screen_name: "faragseif" }, // Seif Farag
  { user_id: 13803858, user_screen_name: "ethanshagaei" }, // Ehsan Shaghaei
  { user_id: 14185528, user_screen_name: "xhashxx" }, // Mohammed Shahin
  { user_id: 12764539, user_screen_name: "KuNurdaulet" }, // Nurdaulet Kunkhozhaev
  { user_id: 8881818, user_screen_name: "nastyaryabkova" }, // Anastasia Ryabkova
  { user_id: 35308463, user_screen_name: "AhmadTh96" }, // Ahmad Taha
  { user_id: 26119146, user_screen_name: "stblacq" }, // Jerome Otobong
  { user_id: 24455535, user_screen_name: "rkharkrang" }, // Randall Kharkrang
  { user_id: 25680626, user_screen_name: "walidkhaled98" }, // Walid Khaled
  { user_id: 17043691, user_screen_name: "mohamed_ahmed1195" }, // Mohamed Ahmed Elsayed
  { user_id: 7897478, user_screen_name: "khaledismaeel" }, // Khaled Ismaeel
].map((o) => ({ ...o, user_screen_name: o.user_screen_name.toLowerCase() }));
