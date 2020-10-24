var mongoose = require("mongoose")

var UserSchema = new mongoose.Schema({
	username: {type: String, required: true, unique: true},
	wallet_address: {type: String, required: false, unique: true},
	role: {type: String},
}, {timestamps: true})

// Virtual for user's full name
// UserSchema
// 	.virtual("fullName")
// 	.get(function () {
// 		return this.firstName + " " + this.lastName;
// 	})

module.exports = mongoose.model("User", UserSchema)