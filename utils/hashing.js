const bycrypt = require('bcryptjs');
const { hash } = require('bcryptjs');

// Hashing function
exports.doHash =(value, saltValue) => {
    const result = hash(value, saltValue);
    return result;
}

exports.doHashValidation = (value, hashedValue) => {
    const result = bycrypt.compare(value, hashedValue);
    return result;
}