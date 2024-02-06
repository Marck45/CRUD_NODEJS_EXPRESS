const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
      },
    name:String,
    email: String,
    password: String,
});

const Login = mongoose.model('Login', loginSchema);

module.exports = Login;