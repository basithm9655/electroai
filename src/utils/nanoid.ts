const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const nanoid = (size = 12): string =>
  Array.from(crypto.getRandomValues(new Uint8Array(size)))
    .map((b) => ALPHABET[b % ALPHABET.length])
    .join('');
