import User from "../models/users.js";
import NotReqError from "../errors/not-req-error.js";
import generatetoken from "../helper/generatetoken.js";
import bcrypt from "bcryptjs";
import NotFoundError from "../errors/not-found-error.js";

export async function createUser(req, res, next) {
  const { email, password, name, lastname } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: email,
      password: hash,
      name: name,
      lastname: lastname,
    });
    if (!hash || !newUser) {
      throw new NotReqError("Usuario no creado por datos no válidos");
    }
    res.status(201).send({ ...newUser });
  } catch (error) {
    next(error);
  }
}

export async function loginUser(req, res, next) {
  const { email, password } = req.body;

  return await User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generatetoken(user);
      res.send({ token });
    })
    .catch(next);
}

export async function getUserInfo(req, res, next) {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("No se ha encontrado ningún usuario con esa id");
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
}
