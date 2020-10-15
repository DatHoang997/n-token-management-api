var express = require("express")
const TokenController = require("../../controllers/TokenController")

var router = express.Router()

router.post("/save_token", TokenController.saveToken)
router.put("/edit_token", TokenController.editToken)
router.post("/delete_token", TokenController.deleteToken)
router.get("/get_token", TokenController.getToken)
router.get("/extension_token_list", TokenController.extensionTokenList)
router.get("/wallet_token_list", TokenController.walletTokenList)

module.exports = router;