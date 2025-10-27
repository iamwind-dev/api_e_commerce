const express = require("express");
const ctr = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const schema = require("../validators/auth.schema");
const { auth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", validate(schema.register), ctr.register);
router.post("/login", validate(schema.login), ctr.login);
router.get("/me", auth, ctr.me);

module.exports = router;
