let express = require("express")
let token = require("./token")
let auth = require("./auth")

let app = express()

app.use("/token/", token)
app.use("/auth/", auth)

module.exports = app;