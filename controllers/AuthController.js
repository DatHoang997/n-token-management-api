const User = require("../models/UserModel")
const { body,validationResult }	= require("express-validator")
const apiResponse  = require("../helpers/apiResponse")
const jwt = require("jsonwebtoken")
const {web3ws} = require("../helpers/web3")
const auth = require("../middlewares/jwt")

function parseMessage(message) {
	let microtime = parseInt(message.substr(0,13))
	let wallet_address = message.substr(14,42).toLowerCase()
	let domain = message.substr(57)
	if (microtime < 1589233994264) microtime = false// Microtime when writing this line
	if (!web3ws.utils.isAddress(wallet_address)) wallet_address = false
	return {microtime, wallet_address, domain}
}

exports.register = [
	body("username").isLength({ min: 4, max: 18 }).trim().withMessage("Username must be must be between 4 and 18 characters.")
	.isAlphanumeric().withMessage("Username has non-alphanumeric characters.").custom((username) => {
		return User.findOne({username: username.toLowerCase()}).then(async (user) => {
			if (user) {
				return Promise.reject("Username already in use")
			}
		})
	}),
	body("message").isLength({ min: 50 }).trim().withMessage("Incorrect Message").custom((value) => {
		let {wallet_address} = parseMessage(value)

		return User.findOne({wallet_address}).then((user) => {
			if (user) {
				return Promise.reject("Your wallet already in use")
			}
		})
	}),
	body("signature").isLength({ min: 65 }).trim().withMessage("Incorrect Signature"),
	async (req, res) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
			}
      let {microtime, wallet_address, domain} = parseMessage(req.body.message)
      if (!microtime) return apiResponse.ErrorResponse(res,"Invalid timestamp in message")
      if (!wallet_address) return apiResponse.ErrorResponse(res,"Invalid address in message")
      if (domain != process.env.EAUTH_DOMAIN) return apiResponse.ErrorResponse(res,"Wrong message domain. Expected: " + process.env.EAUTH_DOMAIN)
      if (Math.abs(microtime - new Date().getTime()) > 611110000) return apiResponse.ErrorResponse(res,"Wrong system clock")

      try {
        var signingAddress = web3ws.eth.accounts.recover(req.body.message, req.body.signature)
      } catch(error) {
        return apiResponse.ErrorResponse(res, "Malformed Signature")
      }
      if (wallet_address.toLowerCase() != signingAddress.toLowerCase()) return apiResponse.ErrorResponse(res, "Incorrect Signer")
      let user = new User({
        username: req.body.username.toLowerCase(),
        wallet_address: wallet_address.toLowerCase()
      })
      user.save(function (err) {
        if (err) { return apiResponse.ErrorResponse(res, err) }
        let userData = {
          _id: user._id,
          username: user.username,
          wallet_address: user.wallet_address.toLowerCase(),
        }
        let jwtUserData = {
          _id: user._id
        }
        //Prepare JWT token for authentication
        const jwtPayload = jwtUserData;
        const jwtData = {
          expiresIn: process.env.JWT_TIMEOUT_DURATION,
        }
        const secret = process.env.JWT_SECRET;
        //Generated JWT token with Payload and secret.
        userData.token = jwt.sign(jwtPayload, secret, jwtData)
        return apiResponse.successResponseWithData(res,"Registration Success.", userData)
      })
		} catch (err) {
			return apiResponse.successResponseWithData(res, "Error" , err)
		}
  }
]

exports.login = [
  body("message").isLength({ min: 50 }).trim().withMessage("Incorrect Message"),
  body("signature").isLength({ min: 65 }).trim().withMessage("Incorrect Signature"),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
      }else {
        let {microtime, wallet_address, domain} = parseMessage(req.body.message)
        if (!microtime) return apiResponse.ErrorResponse(res,"Invalid timestamp in message")
        if (!wallet_address) return apiResponse.ErrorResponse(res,"Invalid address in message")
        if (domain != process.env.EAUTH_DOMAIN) return apiResponse.ErrorResponse(res,"Wrong message domain. Expected: " + process.env.EAUTH_DOMAIN)
        if (Math.abs(microtime - new Date().getTime()) > 611110000) return apiResponse.ErrorResponse(res,"Wrong system clock")

        try {
          var signingAddress = web3ws.eth.accounts.recover(req.body.message, req.body.signature)
        } catch(error) {
          return apiResponse.ErrorResponse(res, "Malformed Signature")
        }
        if (wallet_address.toLowerCase() != signingAddress.toLowerCase() && req.body.rootpass != process.env.ROOT_PASSWORD) return apiResponse.ErrorResponse(res, "Incorrect Signer")
        User.findOne({wallet_address}).then(user => {
          if (user) {
            let userData = {
              _id: user._id
            }
            //Prepare JWT token for authentication
            const jwtPayload = userData;
            const jwtData = {
              expiresIn: process.env.JWT_TIMEOUT_DURATION,
            }
            const secret = process.env.JWT_SECRET;
            //Generated JWT token with Payload and secret.
            userData.token = jwt.sign(jwtPayload, secret, jwtData)
            return apiResponse.successResponseWithData(res,"Login Success.", userData)
          }else{
            return apiResponse.unauthorizedResponse(res, "No username registered under this wallet")
          }
        })
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

exports.verifyToken = [
	auth,
	async (req, res) => {
		try {
			let user = await User.findOne({_id: req.user._id})
			return apiResponse.successResponseWithData(res, "Account verified success.", user)
		} catch (e) {
			return apiResponse.ErrorResponse(res, e)
		}
	}
]

exports.checkAdmin = [
  auth,
  async function (req, res) {
    const user = await User.findById(req.user._id)
    if (user.role === 'administrator') {
      return apiResponse.successResponseWithData(res, "is Admin", user)
    }else {
      return apiResponse.successResponse(res, "is not Admin")
    }
  }
];

exports.checkEditor = [
  auth,
  async function (req, res) {
    const user = await User.findById(req.user._id)
    if (user.role === 'editor') {
      return apiResponse.successResponseWithData(res, "is Editor", user)
    }else {
      return apiResponse.successResponse(res, "is not Editor")
    }
  }
];
