const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserControllers {
  //1. tambahin async dan next
  static async userRegister(req, res, next) {
    try {
      console.log("Masuk ke Controller - Register");

      const { name, email, password, role } = req.body;
      const uniqueValue = await User.findOne({
        where: {
          email,
        },
      });

      if (uniqueValue) {
        throw { status: 400, message: "Email Already Exist!" };
      }

      if (!name || !role || !password || !email) {
        throw { status: 400, message: "Bad Request" };
      }

      const saltRounds = +process.env.SALT_ROUNDS;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);
      console.log(hash, " ===> Ini apa yaa??");

      let inputUser = {
        name,
        email,
        password: hash,
        role,
      };

      const user = await User.create(inputUser);
      res.status(200).json({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      next(err);
    }
  }

  static async userLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw { status: 400, message: "Bad Request" };
      }

      // Check user in DB
      let checkUser = await User.findOne({
        where: {
          email,
        },
      });

      if (!checkUser) {
        throw { status: 400, message: "email or password invalid" };
      }

      const cekPassword = bcrypt.compareSync(password, checkUser.password);
      console.log("Result Check Password ==> ", cekPassword);

      if (!cekPassword) {
        throw { status: 400, message: "email or password invalid" };
      }

      //membuat jwt dari 3 hal penting (biasanya)
      let userDecode = {
        id: checkUser.id,
        name: checkUser.name,
        email: checkUser.email,
        role: checkUser.role,
      };

      const token = jwt.sign(userDecode, process.env.JWT_SECRET_KEY);

      res.status(200).json({
        message: "Login successful",
        token,
        user: userDecode,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserControllers;
