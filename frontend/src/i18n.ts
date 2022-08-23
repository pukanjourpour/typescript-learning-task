import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          guest: "guest",
          "network-error": "Network error",
          "prohibited-username": "Such username is prohibited",
          username: "Username",
          password: "Password",
          "password-repeat": "Repeat password",
          login: "Login",
          register: "Register",
          "different-passwords": "Passwords do not match",
          "browse-playlists": "Browse playlists",
          "my-playlists": "My playlists",
          "login-required-playlists": "You must login to view playlists",
          "create-new-playlist": "Create new playlist",
          "create-new-playlist-title": "Title",
          "create-new-playlist-description": "Description",
          "create-new-playlist-bt": "Create new",
          "song-added": "Song is added",
          "song-not-added": "Could not add song",
          "no-chosen-song": "No song is chosen",
        },
      },
    },
    lng: "en",
    fallbackLng: "en",
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
