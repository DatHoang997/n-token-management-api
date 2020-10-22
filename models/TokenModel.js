var mongoose = require("mongoose")

var TokenSchema = new mongoose.Schema({
	name: {type: String, unique: true},
	network: {type: String},
	symbol: {type: String},
	decimal: {type: Number},
	cmcId: {type: String},
	cgkId: {type: String},
	apiSymbol: {type: String},
	chainType:{type: String},
	address: {type: String},
	logo: {type: String},
	format_address: {type: String},
	segWit: {type: Boolean}
}, {timestamps: true})

module.exports = mongoose.model("Token", TokenSchema)