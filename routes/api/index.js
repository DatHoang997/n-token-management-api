let express = require("express")
let token = require("./token")
let auth = require("./auth")
let dapp = require("./dapp")

let app = express()

app.use("/tokens/", token)
app.use("/auth/", auth)
app.use("/dapps", dapp)

module.exports = app;