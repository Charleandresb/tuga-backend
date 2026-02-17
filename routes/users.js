import express from "express";
import { getUserInfo } from "../controllers/users.js";
import { celebrate, Joi } from "celebrate";

const router = express.Router();

router.get(
  "/me",
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),

  getUserInfo
);

export default router;
