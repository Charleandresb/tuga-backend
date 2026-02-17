import jwt from "jsonwebtoken";
import NotAuthError from "../errors/not-auth-error.js";
import "dotenv/config";

const secretKey = process.env.SECRET_KEY;

export default (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new NotAuthError("Sesión no válida");
    }

    const token = authorization.replace("Bearer ", "");

    let playload;

    playload = jwt.verify(token, secretKey);

    req.user = playload;

    next();
  } catch (error) {
    next(error);
  }
};
