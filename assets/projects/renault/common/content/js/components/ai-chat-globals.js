//const currentMode = typeof CURRENT_DEV_ENV !== "undefined" ? CURRENT_DEV_ENV : "development";
const currentMode = "prod";
const apiBaseUrl = currentMode !== "development" ? "/" : "http://192.168.1.49:8011/proxy/";

export default {
    baseURL: apiBaseUrl,
    endPoint: "php5/auteur/open-ai/create-chat-completion/",
    prompt: `Tu es un professeur de langue spécialisé dans le FLE (Français Langue Étrangère) et tu as comme interlocuteur un élève étranger qui apprend le français.`,
};
