const joi = require('joi');

// Validation schema for user signup
exports.signupSchema = joi.object({
    email: joi.string().min(6).max(255).required().email({
        tlds:{allow:['com', 'net', 'org']}
    }),
    password: joi.string().min(6).max(1024).required(),
});

// Validation schema for user sign-in
exports.signinSchema = joi.object({
    email: joi.string().min(6).max(255).required().email({
        tlds:{allow:['com', 'net', 'org']}
    }),
    password: joi.string().min(6).max(1024).required(),
});