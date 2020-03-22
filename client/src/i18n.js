import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translations: {
          someoneIsTyping: "{{name}} is typing...",
          answer: "Answer",
          altPictureText: "Here should be a picture",
          questionHeader: "Question #{{number}}",
          next: "next",
          previous: "previous",
          tip: "tip",
          chatLabel: "Say something!",
          joinTeam: "Join a public team!"
        }
      },
      de: {
        translations: {
          someoneIsTyping: "{{name}} tippt gerade...",
          answer: "Antwort",
          altPictureText: "Hier sollte ein Bild sein",
          questionHeader: "Frage #{{number}}",
          next: "vor",
          previous: "zurück",
          tip: "Trinkgeld",
          chatLabel: "Sag was!",
          joinTeam: "Tritt einem der öffentlichen Teams bei!"
        }
      }
    },
    fallbackLng: "de",
    debug: true,

    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false,

    interpolation: {
      escapeValue: false
    },

    detection: {
      order: ["navigator", "querystring"],
      lookupQuerystring: "lng"
    }
  });

export default i18n;
