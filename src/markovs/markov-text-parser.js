export class MarkovTextParser {

  // parseText :: String -> [String]
  parseText(text) {
    const sentences = text.split(/[\.!?]/);
    return sentences.map(s => s.trim()).filter(s => s.length > 0);
  }

  // parseSentence :: String -> [String]
  parseSentence(sentence) {
    return this.normalizeString(sentence)
      .split(/\s+/)
      .filter((w) => w.length > 0);
  }

  // normalizeString :: String -> String
  normalizeString(sss) {
    return sss
      .replace(/[^А-Яа-яA-Za-zЁё]/g, ' ')
      .toLowerCase()
      .replace(/ё/g, 'е')
      .trim();
  }

  // hasStopWords :: String -> RegEx.match
  hasStopWords(sss) {
    const re = /(http|\/\/|--)/;
    return sss.match(re);
  }
}
