import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import NotAuthError from "../errors/not-auth-error.js";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm.test(v);
      },
      message: "Lo sentimos, debes ingresar un email válido",
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },

  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlentth: 30,
  },

  lastname: {
    type: String,
    required: true,
    minlength: 2,
    maxlentth: 30,
  },

  country: {
    type: String,
    required: false,
    minlength: 4,
    maxlentth: 30,
    default: "Chile",
  },

  city: {
    type: String,
    required: false,
    minlength: 4,
    maxlentth: 30,
    default: "Cuidad",
  },

  direction: {
    type: String,
    required: false,
    minlength: 8,
    default: "Dirección",
  },

  residence: {
    type: String,
    required: false,
    minlength: 4,
    maxlentth: 15,
    default: "Casa, departamento, etc.",
  },

  postalCode: {
    type: Number,
    required: false,
  },

  commune: {
    type: String,
    required: false,
    minlength: 4,
    maxlentth: 15,
    default: "Comuna",
  },

  region: {
    type: String,
    required: false,
    minlength: 4,
    maxlentth: 15,
    default: "region",
  },

  phone: {
    type: Number,
    required: false,
    default: 987654321,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new NotAuthError("Email o contraseña incorrectos");
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new NotAuthError("Email o contraseña incorrectos");
        }
        return user;
      });
    });
};

const User = mongoose.model("user", userSchema);

export default User;
