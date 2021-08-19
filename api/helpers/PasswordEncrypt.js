const crypto = require("crypto")

class PasswordEncrypt {
    async hash(password) {
        return new Promise((resolve, reject) => {
            // generate random 16 bytes long salt
            const salt = 'PassSECRET'
    
            crypto.scrypt(password, salt, 16, (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey.toString('hex'))
            });
        })
    }
}

module.exports = PasswordEncrypt