import { AbstractHandler } from './abstract-handler';

export class MyIdHandler extends AbstractHandler {
  // handle :: String -> Int -> Int -> Promise(String)
  async handle(text, userId, chatId) {
    return `Your id: ${userId}, chatId: ${chatId}`;
  }
}
