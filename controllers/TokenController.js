const Token = require("../models/TokenModel")
const { body, validationResult } = require("express-validator")
const apiResponse = require("../helpers/apiResponse")
var mongoose = require("mongoose")
var {merchant_status} = require("../helpers/constants")
const global = require("../helpers/global")

var upload = require('../helpers/upload')

mongoose.set("useFindAndModify", false)

exports.saveToken = [
  upload.array('files'),
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
  body("segWit", "segWit can not be empty.").notEmpty().trim(),
  async function (req, res) {
    console.log(req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
    }
    let saved = await Token.findOne({name: req.body.name})
    console.log(saved)
    if (!saved) {
      let token = new Token({
        name: req.body.name,
        network: req.body.network,
        symbol: req.body.symbol,
        decimal: req.body.decimal,
        cmcId: req.body.cmcId,
        cgkId: req.body.cgkId,
        apiSymbol: req.body.apiSymbol,
        chainType: req.body.chainType,
        address: req.body.address,
        logo: req.body.logo,
        format_address: req.body.format_address,
        segWit: req.body.segWit
      })
      token.save()
      return apiResponse.successResponseWithData(res, "Success", token)
    } else {
      return  apiResponse.ErrorResponse(res, "false")
    }
  }
];

exports.editToken = [
  // body("_id", "id can not be empty.").notEmpty().trim(),
  // body("name", "name can not be empty.").notEmpty().trim(),
  // body("network", "network can not be empty.").notEmpty().trim(),
  // body("symbol", "symbol can not be empty.").notEmpty().trim(),
  // body("decimal", "decimal can not be empty.").notEmpty().trim(),
  // body("cmcId", "cmcId can not be empty.").notEmpty().trim(),
  // body("cgkId", "cgkId can not be empty.").notEmpty().trim(),
  // body("apiSymbol", "apiSymbol can not be empty.").notEmpty().trim(),
  // body("chainType", "chainType can not be empty.").notEmpty().trim(),
  // body("address", "address can not be empty.").notEmpty().trim(),
  // body("logo", "logo can not be empty.").notEmpty().trim(),
  // body("format_address", "format_address can not be empty.").notEmpty().trim(),
  // async function (req, res) {
  //   const errors = validationResult(req)
  //   if (!errors.isEmpty()) {
  //     return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
  //   }
  //   console.log(req.body)
  //   let token = {
  //     name: req.body.name,
  //     network: req.body.network,
  //     symbol: req.body.symbol,
  //     decimal: req.body.decimal,
  //     cmcId: req.body.cmcId,
  //     cgkId: req.body.cgkId,
  //     apiSymbol: req.body.apiSymbol,
  //     chainType: req.body.chainType,
  //     address: req.body.address,
  //     logo: req.body.logo,
  //     format_address: req.body.format_address,
  //   }
  //   Token.findByIdAndUpdate(req.params._id, {token},function (err) {
  //     if (err) {
  //       return apiResponse.ErrorResponse(res, err)
  //     }else{
  //       return apiResponse.successResponseWithData(res,"Token update Success.", bookData)
  //     }
  //   })
  // }
];

exports.deleteToken = [
  async function (req, res) {
    let id = await req.params._id
    console.log('id',id)
    Token.findByIdAndRemove(id, function (err) {
      console.log(err)
      if (err) {
        return apiResponse.ErrorResponse(res, err)
      }else{
        console.log('success')
        return apiResponse.successResponse(res,"Token delete Success.")
      }
    })
  }
];

exports.getToken = [
  async function (req, res) {
    const token = await Token.find()
    if (token) {
      return apiResponse.successResponseWithData(res, "Token", token)
    }else {
      return apiResponse.ErrorResponse(res, "not found any tokens")
    }
  }
];

exports.extensionTokenList = [
  async function (req, res) {
    let arr = []
    const token = await Token.find()
    console.log(token)
    if (token) {
      for (let i = 0; i < token.length; i++) {
        arr.push({
          network: token[i].network,
          name: token[i].name,
          symbol: token[i].symbol,
          decimal: parseFloat(token[i].decimal),
          cmcId: parseFloat(token[i].cmcId),
          cgkId: token[i].cgkId,
          apiSymbol: token[i].apiSymbol,
          chainType: token[i].chainType,
          isSegWit: token[i].segWit
        })
      }
      return apiResponse.sendToken(res, arr)
    }else {
      return apiResponse.ErrorResponse(res, "not found any tokens")
    }
  }
];

exports.walletTokenList = [
  async function (req, res) {
    let arr = []
    const token = await Token.find()
    console.log(token)
    if (token) {
      console.log(token[1].symbol)
      for (let i = 0; i < token.length; i++) {
        console.log('fffffffffff',i)
        arr.push({
          network: token[i].network,
          name: token[i].name,
          symbol: token[i].symbol,
          decimal: parseFloat(token[i].decimal),
          logo: token[i].logo,
          address: token[i].address,
          format_address: token[i].format_address,
          id_market: token[i].cmcId
        })
      }
      return apiResponse.sendToken(res, arr)
    }else {
      return apiResponse.ErrorResponse(res, "not found any tokens")
    }
  }
];

