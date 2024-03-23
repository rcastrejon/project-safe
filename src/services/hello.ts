// https://elysiajs.com/patterns/mvc.html#service
//
// If the service doesn't need to store a property, you may use abstract class
// and static instead to avoid allocating class instance.
//
// But if the service involve local mutation eg. caching, you may want to
// initiate an instance instead.

export abstract class HelloService {
  static sayHello(name: string) {
    let trimmedName = name.trim();
    if (trimmedName.length === 0) {
      trimmedName = "world";
    }
    return `Hello, ${trimmedName}!`;
  }
}
