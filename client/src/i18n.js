import i18n from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next  } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translations: {
          hannes: "Hannes is typing...",
          answer: "Answer",
          altPictureText: "Here should be a picture",
          questionHeader: "Question #{{number}}",
          next: "next",
          previous: "previous",
          tip: "tip",
          chatLabel: "Say something!",
          joinTeam: "Join a public team!",
          people: "people",
          loading: "Loading...",
          error: "Error: {{message}}",
          pubs: "Pubs: {{pubs}}",
          team: "Team: '{{name}}'",
          groups: "groups",
          player: "player",
          quizmaster: "quizmaster",
          host: "host",
          login: "login",
          logout: "logout",
          quiz: "quiz",
          quizStart: "Quiz starts at",
          save: "save",
          addRound: "add round",
          yourName: "your name",
          letsGo: "lets go!",
          iAmAPubOwner: "I am a pub owner",
          yourTeamName: "your team name",
          startTeam: "start team!",
          areYouAlone: "Are you alone? Join an other team!",
          makeTeamPublic: "open for other players",
          prost: "Prost!"
        }
      },
      de: {
        translations: {
          hannes: "Hannes tippt gerade...",
          answer: "Antwort",
          altPictureText: "Hier sollte ein Bild sein",
          questionHeader: "Frage #{{number}}",
          next: "vor",
          previous: "zurück",
          tip: "Trinkgeld",
          chatLabel: "Sag was!",
          joinTeam: "Tritt einem der öffentlichen Teams bei!",
          people: "Personen",
          loading: "Wird geladen...",
          error: "Fehler: {{message}}",
          pubs: "Pubs: {{pubs}}",
          team: "Team: '{{name}}'",
          groups: "Gruppen",
          player: "Spieler",
          quizmaster: "Spielemeister^^",
          host: "Hostierer",
          login: "Einloggen",
          logout: "Ausloggen",
          quiz: "Rätsel",
          quizStart: "Quizbeginn",
          save: "speichern",
          addRound: "Runde hinzufügen",
          yourName: "Dein Name",
          letsGo: "Los geht's!",
          iAmAPubOwner: "Ich bin Pub-Betreiber",
          yourTeamName: "Name deines Teams",
          startTeam: "Team starten",
          areYouAlone: "Alleine hier? Schließe dich einem anderen Team an!",
          makeTeamPublic: "Team für andere öffnen",
          prost: "Prost!"
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

    detection:{
        order: ['navigator','querystring'],
        lookupQuerystring: 'lng'
    }
  });

export default i18n;
