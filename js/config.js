/*
  WEBSITE SETTINGS
  =================
  This project starts in "local" mode so it works immediately.

  local    = wishes only stay inside the current browser.
  supabase = everyone sees the same wishes online.

  Read SETUP-SUPABASE.md before changing this file.
*/

window.JENIFFER_CONFIG = {
  mode: "supabase",

  // Fill these two values only when you are ready to use Supabase.
  supabaseUrl: "https://wnevpiunqygalwrbyxkm.supabase.co",
  supabasePublishableKey: "sb_publishable_0zeY6s5QUJU1-yik9rfJFA_6T2h5-Fr",

  // Older Supabase projects can still use the legacy anon key here.
  supabaseAnonKey: "",

  // Do not change these unless you also change the SQL setup file.
  tableName: "birthday_wishes",
  bucketName: "birthday-avatars"
};
