const Token = require("../models/TokenModel")
const { body, validationResult } = require("express-validator")
const apiResponse = require("../helpers/apiResponse")
var mongoose = require("mongoose")
var {merchant_status} = require("../helpers/constants")
const global = require("../helpers/global")

mongoose.set("useFindAndModify", false)

exports.saveToken = [
  body("name", "name can not be empty.").notEmpty().trim(),
  body("network", "network can not be empty.").notEmpty().trim(),
  body("symbol", "symbol can not be empty.").notEmpty().trim(),
  body("decimal", "decimal can not be empty.").notEmpty().trim(),
  body("cmcId", "cmcId can not be empty.").notEmpty().trim(),
  body("cgkId", "cgkId can not be empty.").notEmpty().trim(),
  body("apiSymbol", "apiSymbol can not be empty.").notEmpty().trim(),
  body("chainType", "chainType can not be empty.").notEmpty().trim(),
  body("address", "address can not be empty.").notEmpty().trim(),
  body("logo", "logo can not be empty.").notEmpty().trim(),
  body("format_address", "format_address can not be empty.").notEmpty().trim(),
  async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
    }
    console.log(req.body)
    let saved = await Token.findOne({name: req.body.name})
    if (saved) {
      let token = new Token({
        name: rep.body.name,
        network: rep.body.network,
        symbol: rep.body.symbol,
        decimal: rep.body.decimal,
        cmcId: rep.body.cmcId,
        cgkId: rep.body.cgkId,
        apiSymbol: rep.body.apiSymbol,
        chainType: rep.body.chainType,
        address: rep.body.address,
        logo: rep.body.logo,
        format_address: rep.body.format_address,
      })
      token.save()
      return apiResponse.successResponseWithData(res, "Success", user)
    } else {
      return  apiResponse.ErrorResponse(res, "false")
    }
  }
];

exports.editToken = [
  body("_id", "id can not be empty.").notEmpty().trim(),
  body("name", "name can not be empty.").notEmpty().trim(),
  body("network", "network can not be empty.").notEmpty().trim(),
  body("symbol", "symbol can not be empty.").notEmpty().trim(),
  body("decimal", "decimal can not be empty.").notEmpty().trim(),
  body("cmcId", "cmcId can not be empty.").notEmpty().trim(),
  body("cgkId", "cgkId can not be empty.").notEmpty().trim(),
  body("apiSymbol", "apiSymbol can not be empty.").notEmpty().trim(),
  body("chainType", "chainType can not be empty.").notEmpty().trim(),
  body("address", "address can not be empty.").notEmpty().trim(),
  body("logo", "logo can not be empty.").notEmpty().trim(),
  body("format_address", "format_address can not be empty.").notEmpty().trim(),
  async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
    }
    console.log(req.body)
    let token = {
      name: rep.body.name,
      network: rep.body.network,
      symbol: rep.body.symbol,
      decimal: rep.body.decimal,
      cmcId: rep.body.cmcId,
      cgkId: rep.body.cgkId,
      apiSymbol: rep.body.apiSymbol,
      chainType: rep.body.chainType,
      address: rep.body.address,
      logo: rep.body.logo,
      format_address: rep.body.format_address,
    }
    Token.findByIdAndUpdate(req.params._id, {token},function (err) {
      if (err) {
        return apiResponse.ErrorResponse(res, err)
      }else{
        return apiResponse.successResponseWithData(res,"Token update Success.", bookData)
      }
    })
  }
];

exports.deleteToken = [
  async function (req, res) {
    Token.findByIdAndRemove(req.body._id,function (err) {
      if (err) {
        return apiResponse.ErrorResponse(res, err)
      }else{
        return apiResponse.successResponse(res,"Book delete Success.")
      }
    })
  }
];

exports.getToken = [
  async function (req, res) {
    const token = await Token.find()
    if (user) {
      return apiResponse.successResponseWithData(res, "Token", token)
    }else {
      return apiResponse.ErrorResponse(res, "not found any tokens")
    }
  }
];

exports.extensionTokenList = [
  async function (req, res) {
    let arr = []
    let obj = {}
    Adventure.count({ type: 'jungle' }, function (err, count) {
      if (err) return apiResponse.ErrorResponse(res, "not found any tokens")
      const token = await Token.find()
      if (user) {
        for (let i = 0; i < count; i++) {
          obj = {
            network: user.network,
            name: user.name,
            symbol: user.symbol,
            decimal: parseFloat(user.decimal),
            cmcId: parseFloat(user.cmcId),
            apiSymbol: user.apiSymbol,
            chainType: user.chainType
          }
          arr.push(obj)
          obj = {}
        }
        return apiResponse.successResponseWithData(res, "Token", token)
      }else {
        return apiResponse.ErrorResponse(res, "not found any tokens")
      }
    });
  }
];

exports.walletTokenList = [
  async function (req, res) {
    let arr = []
    let obj = {}
    Adventure.count({ type: 'jungle' }, function (err, count) {
      if (err) return apiResponse.ErrorResponse(res, "not found any tokens")
      const token = await Token.find()
      if (user) {
        for (let i = 0; i < count; i++) {
          obj = {
            network: user.network,
            name: user.name,
            symbol: user.symbol,
            decimal: parseFloat(user.decimal),
            logo: user.logo,
            address: user.address,
            format_address: user.format_address,
            id_market: user.cmcId
          }
          arr.push(obj)
          obj = {}
        }
        return apiResponse.successResponseWithData(res, "Token", token)
      }else {
        return apiResponse.ErrorResponse(res, "not found any tokens")
      }
    });
  }
];
