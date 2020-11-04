const express = require("express")
const AuthController = require("../../controllers/AuthController")

var router = express.Router()

router.post("/register", AuthController.register)
router.post("/login", AuthController.login)
router.post("/verify-token", AuthController.verifyToken)
router.get("/check-editor", AuthController.checkEditor)
router.get("/check-admin", AuthController.checkAdmin)

module.exports = router;