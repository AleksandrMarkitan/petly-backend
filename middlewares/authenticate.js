const jwt = require("jsonwebtoken");
require("dotenv").config();

const { HttpError } = require("../helpers");
const { User } = require("../models/user"); //Перевірити назву моделі

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token) {
      next(HttpError(401));
    }
    req.user = user; // записує в запит інформацію про юзера, який робить цей запит
    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = authenticate;
