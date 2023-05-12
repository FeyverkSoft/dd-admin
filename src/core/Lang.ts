import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from '../i18n/ru.json';

const resources = {
    ru,
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "ru",
        fallbackLng: "ru",
        keySeparator: '.',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;