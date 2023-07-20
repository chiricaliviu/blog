import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator/src/validation-result";
import { UserModel } from "../models/user";
import { StatusError } from "../helper/statusError";
import { hash, compare } from "bcrypt";
import * as jwt from "jsonwebtoken";

export const signUp = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new StatusError("Creating user failed!");
    error.status = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const secretCode = req.body.secretCode;
  hash(password, 12)
    .then((hashedPW) => {
      const user = new UserModel({
        email: email,
        password: hashedPW,
        name: name,
        secretCode: secretCode,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User Created!", userId: result._id });
    })
    .catch((err) => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

export const logIn = (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser: any;

  UserModel.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new StatusError(
          "User with this email could not be found"
        );
        error.status = 401;

        throw error;
      }
      loadedUser = user;
      return compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new StatusError("Wrong password!");
        error.status = 401;
        throw error;
      }
      const token = jwt.sign(
        { email: loadedUser.email, userId: loadedUser._id.toString() },
        "secret",
        { expiresIn: "1h" }
      );
      res.status(200).json({token: token, userId: loadedUser._id.toString()});
    })
    .catch((err) => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

export const changePassword = (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.password;
    const secretCode = req.body.secretCode;
    const email = req.body.email;
    let loadedUser: any;
    UserModel.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new StatusError("User with this email could not be found");
        error.status = 401;
        throw error;
      }
      loadedUser = user;
      if (user.secretCode !== secretCode) {
        const error = new StatusError("Wrong secret code!");
        error.status = 401;
        throw error;
      }
        hash(newPassword, 12)
        .then((hashedPW) => {
          
            user.email = loadedUser.email
            user.password = hashedPW
            user.name = loadedUser.name
            user.secretCode = loadedUser.secretCode
            return user.save();
          })
      })
    .then((result) => {
        console.log(result);
        res.status(201).json({ message: "Password has been changed", user: loadedUser.email});
      })
    .catch((err) => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
}
