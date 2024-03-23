export abstract class HelloService {
  static sayHello(name: string) {
    let trimmedName = name.trim();
    if (trimmedName.length === 0) {
      trimmedName = "world";
    }
    return `Hello, ${trimmedName}!`;
  }
}
