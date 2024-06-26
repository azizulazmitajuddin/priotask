import * as CryptoJS from 'crypto-js';
// compare with https://the-x.cn/en-us/cryptography/Aes.aspx AES ECB Zero 128bits

let key = 'ThisTheSecretKey'; // must be 16 character
key = CryptoJS.enc.Utf8.parse(key);

export const EncryptedData = (textInput) => {
  let text = textInput;

  // Fix: Use the Utf8 encoder (or apply in combination with the hex encoder a 32 hex digit key for AES-128)
  text = CryptoJS.enc.Utf8.parse(text);

  // Fix: Apply padding (e.g. Zero padding). Note that PKCS#7 padding is more reliable and that ECB is insecure
  var encrypted = CryptoJS.AES.encrypt(text, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding,
  });
  encrypted = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  return textInput ? encrypted : textInput;
};

export const DecryptedData = (encrypted) => {
  // Fix: Pass a CipherParams object (or the Base64 encoded ciphertext)
  var decrypted = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(encrypted) }, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding,
  });
  // Fix: Utf8 decode the decrypted data
  decrypted = decrypted.toString(CryptoJS.enc.Utf8);
  return decrypted;
};

const objectsEqual = (o1, o2) =>
  typeof o1 === 'object' && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;

export const arraysEqual = (a1, a2) =>
  a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
