import { AbstractHandler } from './abstract-handler';

export class EchoHandler extends AbstractHandler {
  // handle :: String -> Int -> Int -> Promise(String)
  async handle(text) {
    return text;
  }
}
