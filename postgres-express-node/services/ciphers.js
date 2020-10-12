const crypto = require("crypto");

function encrypt({
  mode,
  key,
  iv = Buffer.alloc(0),
  plaintext,
  padding = true,
  inputEncoding = "utf8",
  outputEncoding = "hex",
}) {
  const cipher = crypto.createCipheriv(mode, key, iv);
  cipher.setAutoPadding(padding);
  let ciphertext = cipher.update(plaintext, inputEncoding, outputEncoding);
  ciphertext += cipher.final(outputEncoding);

  return {
    iv: iv.toString(outputEncoding),
    ciphertext,
  };
}

function decrypt({
  mode,
  key,
  iv = Buffer.alloc(0),
  ciphertext,
  padding = true,
  inputEncoding = "hex",
  outputEncoding = "utf8",
}) {
  const decipher = crypto.createDecipheriv(mode, key, iv);
  decipher.setAutoPadding(padding);
  let plaintext = decipher.update(ciphertext, inputEncoding, outputEncoding);
  plaintext += decipher.final(outputEncoding);

  return { plaintext };
}

function encrypt_GCM({
  key,
  iv,
  plaintext,
  inputEncoding = "utf8",
  outputEncoding = "hex",
}) {
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let ciphertext = cipher.update(plaintext, inputEncoding, outputEncoding);
  ciphertext += cipher.final(outputEncoding);
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString(outputEncoding),
    ciphertext,
    tag: tag.toString(outputEncoding),
  };
}

function decrypt_GCM({
  key,
  msgContent,
  inputEncoding = "hex",
  outputEncoding = "utf8",
}) {
  // We expect 'hex' input encoding
  const iv_length = 24; // 'hex' (96 bits)
  const tag_length = 32; // 'hex' (128 bits)
  const ciphertext_length = msgContent.length - tag_length;

  const iv = Buffer.from(msgContent.slice(0, iv_length), "hex");
  const ciphertext = msgContent.slice(iv_length, ciphertext_length);
  const tag = Buffer.from(msgContent.slice(ciphertext_length), "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  let plaintext = decipher.update(ciphertext, inputEncoding, outputEncoding);
  plaintext += decipher.final(outputEncoding);

  return plaintext;
}

exports.ecb = {
  encrypt: (params) => encrypt({ mode: "aes-256-ecb", ...params }),
  decrypt: (params) => decrypt({ mode: "aes-256-ecb", ...params }),
};

exports.cbc = {
  encrypt: (params) => encrypt({ mode: "aes-256-cbc", ...params }),
  decrypt: (params) => decrypt({ mode: "aes-256-cbc", ...params }),
};

exports.ctr = {
  encrypt: (params) => encrypt({ mode: "aes-256-ctr", ...params }),
  decrypt: (params) => encrypt({ mode: "aes-256-ctr", ...params }),
};

exports.gcm = {
  encrypt: (params) => encrypt_GCM({ ...params }),
  decrypt: (params) => decrypt_GCM({ ...params }),
};
