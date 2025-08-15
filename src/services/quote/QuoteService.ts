import type QuoteProvider from "./QuoteProvider";

const quotesService: QuoteProvider = {
  async getQuote() {
    try {
      const res = await fetch(`https://api.quotable.io/random`);

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();

      const { content, author } = data;

      const filteredData = {
        author: author,
        text: content,
      };

      return filteredData;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export default quotesService;
