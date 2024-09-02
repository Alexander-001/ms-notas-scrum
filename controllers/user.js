// const Mechanic = require("../models/Mechanic");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authUser = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(200).json({
        errors: errors.array(),
      });
    }
    const { email, password } = request.body;
    let user = await User.findOne({ email });
    if (!user) {
      return response.json({
        message: "El usuario no existe.",
        user: {},
        token: "",
      });
    }
    const successPassword = await bcrypt.compareSync(password, user.password);
    if (!successPassword) {
      return response.json({
        message: "La contraseña es incorrecta.",
        user: {},
        token: "",
      });
    }
    const payload = {
      user: {
        name: user.name,
        email: user.email,
      },
    };
    jwt.sign(
      payload,
      process.env.KEY_SECRET,
      {
        expiresIn: "1h",
      },
      (error, token) => {
        if (error) throw error;
        return response.status(200).json({
          message: "Login correcto",
          user,
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Hubo un error al iniciar sesión",
      user: {},
      token: "",
    });
  }
};

const generateToken = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(200).json({ errors: errors.array() });
    }
    const { name, email } = request.body;
    const payload = {
      user: {
        name: name,
        email: email,
      },
    };
    jwt.sign(
      payload,
      process.env.KEY_SECRET,
      {
        expiresIn: "1h",
      },
      (error, token) => {
        if (error) throw error;
        return response.status(200).json({
          message: "Login correcto",
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Hubo un error al generar token.",
      user: {},
      token: "",
    });
  }
};

const addUser = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(200).json({ errors: errors.array() });
    }
    const { email, password } = request.body;
    let user = await User.findOne({ email });
    if (user) {
      return response.status(200).json({
        message: "Usuario ya existe",
        user: {},
      });
    }
    user = new User(request.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    return response.status(200).json({
      message: "Usuario creado correctamente",
      user,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Hubo un error al ingresar usuario",
      user: {},
    });
  }
};

const updateUser = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(200).json({ errors: errors.array() });
    }
    const { email, name, password } = request.body;
    let user = await User.findOne({ email });
    if (!user) {
      return response.status(200).json({
        message: "Usuario no existe",
        user: {},
      });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.name = name;
    await user.save();
    response.status(200).json({
      message: "Usuario actualizado",
      user,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Hubo un error al modificar usuario",
      user: {},
    });
  }
};

const getUsers = async (_, response) => {
  try {
    let users = await User.find().select("-password");
    return response.status(200).json({
      message: "Usuarios",
      users,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Hubo un error al obtener usuarios",
      users: [],
    });
  }
};

const getUserByEmail = async (request, response) => {
  try {
    const user = await User.findOne({
      email: request.params.email,
    }).select("-password");
    response.status(200).json({
      message: "Usuario encontrado",
      user,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Hubo un error al obtener usuario",
      user: {},
    });
  }
};

const deleteUser = async (request, response) => {
  try {
    const { email } = request.body;
    let user = await User.findOne({ email });
    if (!user) {
      return response.status(200).json({
        message: "Usuario no existe",
        user: {},
      });
    }
    await User.deleteOne({ email });
    response.status(200).json({
      message: "Usuario eliminado correctamente",
      user: {},
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Hubo un error al eliminar usuario",
      user: {},
    });
  }
};

module.exports = {
  authUser,
  generateToken,
  addUser,
  updateUser,
  getUsers,
  getUserByEmail,
  deleteUser,
};
