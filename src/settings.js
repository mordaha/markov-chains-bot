export const APP_MODE = process.env.APP_MODE;
export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
export const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(/\s+/).map(s => parseInt(s, 10));
export const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
export const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
export const TWITTER_ACCESS_TOKEN_KEY = process.env.TWITTER_ACCESS_TOKEN_KEY;
export const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;
