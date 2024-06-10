const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class User {
  static assertValidEmail(email: string): void {
    if (!emailRegex.test(email)) throw new Error('Invalid Email Address');
  }
}
