let express = require("express")
let token = require("./token")

let app = express()

app.use("/token/", token)

module.exports = app;