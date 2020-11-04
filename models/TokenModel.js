var mongoose = require("mongoose")

var TokenSchema = new mongoose.Schema({
	accept_status: {type: Boolean, required: true},
	name: {type: String, unique: true},
	network: {type: String, required: true},
	symbol: {type: String, required: false},
	decimal: {type: Number, required: true},
	format_address: {type: String, required: false},
	address: {type: String, required: false},
	cmcId: {type: String, required: false},
	cgkId: {type: String, required: false},
	apiSymbol: {type: String, required: false},
	chainType:{type: String, required: false},
	logo: {type: String, required: false},
	segWit: {type: Boolean, required: false},
	legacy: {type: String, required: false},
	suffix: {type: String, required: false}
}, {timestamps: true})

module.exports = mongoose.model("Token", TokenSchema)