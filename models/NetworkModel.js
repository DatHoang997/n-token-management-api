var mongoose = require("mongoose")

var NetworksSchema = new mongoose.Schema({
	networks: {type: String, required: true, unique: true},
	explorer: {type: String, required: true},
	isSegWit: {type: Boolean, required: true},
}, {timestamps: true})

module.exports = mongoose.model("networks", NetworksSchema)