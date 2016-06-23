export const APP_MODE = process.env.APP_MODE;
export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
export const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(/\s+/).map(s => parseInt(s, 10));
