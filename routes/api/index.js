let express             = require("express")
let token                = require("./token")
const auth              = require("../../middlewares/jwt")
const adminRole         = require("../../middlewares/admin")

let app = express()

app.use("/token/", token)

module.exports = app;