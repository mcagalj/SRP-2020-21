// NOTE: This is adapted from https://gist.github.com/ajmas/b7c2df45d69a131b62b18ae91ee0602b
//
// Code to encrypt data in sequelize fields

// Fields are broken down to facilitate unit testing.
//
// based on code here: http://vancelucas.com/blog/stronger-encryption-and-decryption-in-node-js/
//
// Use this when definiing your model. For example:
//
// model = {
//   myField: fieldEncryption('myField', {
//     type: Sequelize.STRING,
//     field: 'my_field'
//   });
// }
//

const crypto = require("crypto");

// IMPORTANT: GCM encryption mode is based on the counter mode (CTR)
// of encryption. CTR mode does not hide the message length. This means
// that even encrypted message can reveal information about what has
// been encrypted. Consequently, in DB applications we should pad all
// plaintext messages to the same size before encrypting them. Otherwise,
// an adversary could easily see which of the possible plaintext has been
// encrypted by merely comparing the size of the resulting ciphertexts.
// TBD
function encrypt_GCM({
  key,
  plaintext,
  aad,
  inputEncoding = "utf8",
  outputEncoding = "base64",
}) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  if (aad) {
    // Authenticating (not encrypting) additional data
    cipher.setAAD(Buffer.from(aad, inputEncoding));
  }
  let ciphertext = cipher.update(plaintext, inputEncoding, outputEncoding);
  ciphertext += cipher.final(outputEncoding);
  const tag = cipher.getAuthTag();

  const sealedData =
    iv.toString(outputEncoding) +
    " " +
    ciphertext +
    " " +
    tag.toString(outputEncoding);

  return sealedData;
}

function decrypt_GCM({
  key,
  message,
  aad,
  inputEncoding = "base64",
  outputEncoding = "utf8",
}) {
  const messageParts = message.split(" ");
  const iv = Buffer.from(messageParts.shift(), inputEncoding);
  const ciphertext = Buffer.from(messageParts.shift(), inputEncoding);
  const tag = Buffer.from(messageParts.shift(), inputEncoding);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  if (aad) {
    // Authenticating (not encrypting) additional data
    decipher.setAAD(Buffer.from(aad, outputEncoding));
  }
  let plaintext = decipher.update(ciphertext, inputEncoding, outputEncoding);
  plaintext += decipher.final(outputEncoding);

  return plaintext;
}

function fieldEncryption(fieldName, options = {}) {
  const key = Buffer.from(process.env.DB_FIELD_ENC_KEY, "base64");

  const ops = {
    set: function (value) {
      if (value && value !== null) {
        this.setDataValue(fieldName, encrypt_GCM({ plaintext: value, key }));
      } else {
        this.setDataValue(fieldName, null);
      }
    },

    get: function () {
      const value = this.getDataValue(fieldName);
      if (value && value !== null) {
        return decrypt_GCM({ message: value, key });
      } else {
        return null;
      }
    },
  };

  return Object.assign(ops, options);
}

module.exports = {
  fieldEncryption,
  encrypt: encrypt_GCM,
  decrypt: decrypt_GCM,
};
