const { Schema, model } = require('mongoose');
const validator = require('validator');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(v) {
          return validator.isEmail(v);
        },
        message: 'Укажите корректный формат Email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      // validate: {
      //   validator(v) {
      //     return /^[а-яА-ЯёЁ0-9]+$/.test(v);
      //   },
      //   message: 'Используйте кириллический алфавит',
      // },
    },
  },
  { versionKey: false },
);

module.exports = model('user', userSchema);
