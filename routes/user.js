const { Router } = require("express");
const {
  addUser,
  getUsers,
  updateUser,
  getUserByEmail,
  deleteUser,
  authUser,
  generateToken,
} = require("../controllers/user");
const { check } = require("express-validator");

const router = Router();

const validationParams = [
  check("name", "Se debe ingresar usuario").not().isEmpty(),
  check("email", "Se debe ingresar email").not().isEmpty(),
  check("password", "Se debe ingresar contraseña").not().isEmpty(),
  check("email", "Formato de correo inválido.").isEmail(),
  check(
    "password",
    "Contraseña debe ser mayor o igual a 6 caracteres."
  ).isLength(6),
];

const validateLogin = [
  check("email", "Se debe ingresar correo").not().isEmpty(),
  check("email", "Formato de correo inválido.").isEmail(),
  check("password", "Se debe ingresar contraseña.").not().isEmpty(),
  check(
    "password",
    "Contraseña debe ser mayor o igual a 6 caracteres."
  ).isLength(6),
];

const validateToken = [
  check("name", "Se debe ingresar nombre de usuario").not().isEmpty(),
  check("email", "Se debe ingresar correo.").not().isEmpty(),
  check("email", "Formato de correo inválido.").isEmail(),
];

router.post("/add", validationParams, addUser);
router.post("/auth", validateLogin, authUser);
router.post("/generate-token", validateToken, generateToken);
router.patch("/update", validationParams, updateUser);
router.get("/", getUsers);
router.get("/:email", getUserByEmail);
router.delete("/delete", deleteUser);

module.exports = router;
