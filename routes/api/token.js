const express = require("express")
const DataController = require("../../controllers/dataController")

var router = express.Router()

router.post("/save_token", DataController.saveToken)
router.put("/edit_token", DataController.editToken)
router.put("/accept_token", DataController.acceptToken)
router.delete("/delete_token/:_id", DataController.deleteToken)
router.get("/get_token", DataController.getToken)
router.get("/get_accepted_token", DataController.getAcceptedToken)
router.get("/get_waiting_token", DataController.getWaitingToken)
router.get("/extension", DataController.extensionTokenList)
router.get("/mobile", DataController.walletTokenList)
router.post("/save_network", DataController.saveNetwork)
router.put("/edit_network", DataController.editNetwork)
router.get("/get_network", DataController.getNetwork)
router.delete("/delete_network/:_id", DataController.deleteNetwork)
router.post("/save_dapp", DataController.saveDapp)
router.put("/edit_dapp", DataController.editDapp)
router.get("/get_dapp", DataController.getDapp)
router.delete("/delete_dapp/:_id", DataController.deleteDapp)

module.exports = router;