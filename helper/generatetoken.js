import jwt from "jsonwebtoken";
import "dotenv/config";

const secretKey = process.env.SECRET_KEY;

export default function generatetoken(user) {
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    secretKey,
    { expiresIn: "7d" }
  );

  return token;
}
