export function generateCode(length: number = 7): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const chars_length = 62;
  let res: string = "";

  for (let i = 0; i < length; i++) {
    const randomIndex: number = Math.floor(Math.random() * chars_length);
    res += chars[randomIndex];
  }
  return res;
}
