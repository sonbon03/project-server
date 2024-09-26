export function checkText(input: string): boolean {
  const specialCharsRegex: RegExp = /[!@#$%^&*(),.?":{}|<>]/g;
  return specialCharsRegex.test(input);
}
