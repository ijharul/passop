import CryptoJS from 'crypto-js';

// PBKDF2 parameters for key derivation
const ITERATIONS = 10000;
const KEY_SIZE = 256 / 32; // 256 bits

/**
 * Derives a strong encryption key from a master password and salt.
 */
export const deriveKey = (masterPassword, salt) => {
  return CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: KEY_SIZE,
    iterations: ITERATIONS
  }).toString();
};

/**
 * Encrypts data using a derived key.
 * Returns a string containing encrypted data and IV.
 */
export const encryptData = (data, key) => {
  if (!data) return '';
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Hex.parse(key), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return {
    ciphertext: encrypted.toString(),
    iv: iv.toString()
  };
};

/**
 * Decrypts data using a derived key and IV.
 */
export const decryptData = (ciphertext, key, iv) => {
  try {
    if (!ciphertext || !key || !iv) return '';
    const decrypted = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Hex.parse(key), {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Decryption failed:", e);
    return "Error: Decryption failed";
  }
};
