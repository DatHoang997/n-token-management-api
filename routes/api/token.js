const express = require("express")
const TokenController = require("../../controllers/TokenController")

var router = express.Router()

router.post("/save_token", TokenController.saveToken)
router.put("/edit_token", TokenController.editToken)
router.put("/accept_token", TokenController.acceptToken)
router.delete("/delete_token/:_id", TokenController.deleteToken)
router.get("/get_token", TokenController.getToken)
router.get("/get_accepted_token", TokenController.getAcceptedToken)
router.get("/get_waiting_token", TokenController.getWaitingToken)
router.get("/extension_token_list", TokenController.extensionTokenList)
router.get("/wallet_token_list", TokenController.walletTokenList)
router.post("/save_network", TokenController.saveNetwork)
router.put("/edit_network", TokenController.editNetwork)
router.get("/get_network", TokenController.getNetwork)
router.delete("/delete_network/:_id", TokenController.deleteNetwork)

module.exports = router;