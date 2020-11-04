var mongoose = require("mongoose")

var DappSchema = new mongoose.Schema({
	name: {type: String, required: true},
	title: {type: String, required: true},
	url: {type: String, required: true},
  img: {type: String, required: true},
  network: {type: String, required: true},
}, {timestamps: true})

module.exports = mongoose.model("Dapp", DappSchema)