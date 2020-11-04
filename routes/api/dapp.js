const express = require("express")
const DataController = require("../../controllers/dataController")

var router = express.Router()

router.get("/", DataController.getDapp)

module.exports = router;