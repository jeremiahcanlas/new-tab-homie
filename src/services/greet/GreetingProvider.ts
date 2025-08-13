export default interface GreetingProvider {
  getGreeting(): Promise<string>;
}
