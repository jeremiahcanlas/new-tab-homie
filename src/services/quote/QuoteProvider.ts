export default interface QuoteProvider {
  getQuote(): Promise<{ author: string; text: string } | null>;
}
