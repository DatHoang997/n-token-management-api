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
  body("_id", "id can not be empty.").notEmpty().trim(),
  body("name", "name can not be empty.").notEmpty().trim(),
  body("network", "network can not be empty.").notEmpty().trim(),
  body("symbol", "symbol can not be empty.").notEmpty().trim(),
  body("decimal", "decimal can not be empty.").notEmpty().trim(),
  body("format_address", "format_address can not be empty.").notEmpty().trim(),
  async function (req, res) {
    console.log(req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
    }
    let saved = await Token.findOne({name: req.body.name})
    console.log(saved, req.body.segWit)
    if (!saved && !req.body.segWit) {
      console.log('innnnnn')
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
        status_accept: false
      })
      token.save()
      return apiResponse.successResponseWithData(res, "Success", token)
    } else if (!saved && req.body.segWit) {
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
        segWit: req.body.segWit,
        status_accept: false
      })
      token.save()
      return apiResponse.successResponseWithData(res, "Success", token)
    } else {
      return  apiResponse.ErrorResponse(res, "false")
    }
  }
];

exports.editToken = [
  upload.array('files'),
  body("_id", "id can not be empty.").notEmpty().trim(),
  body("name", "name can not be empty.").notEmpty().trim(),
  body("network", "network can not be empty.").notEmpty().trim(),
  body("symbol", "symbol can not be empty.").notEmpty().trim(),
  body("decimal", "decimal can not be empty.").notEmpty().trim(),
  body("format_address", "format_address can not be empty.").notEmpty().trim(),
  async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors)
      return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
    }
    console.log(req.body)
    try {
      if (!req.body.segWit) {
        console.log('aloooo')
        let update = await Token.findOneAndUpdate({
          _id: req.body._id
        }, {
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
        })
        console.log(update)
        return apiResponse.successResponseWithData(res, "Success", update)
      } else if (req.body.segWit) {
        let update = await Token.findOneAndUpdate({
          _id: req.body._id
        }, {
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
        return apiResponse.successResponseWithData(res, "Success", update)
      }
    }
    catch (err){
      console.log(err)
      return  apiResponse.ErrorResponse(res, "false")
    }
  }
];

exports.acceptToken = [
  upload.array('files'),
  body("_id", "id can not be empty.").notEmpty().trim(),
  async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors)
      return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
    }
    console.log(req.body)
    try {
      console.log('aloooo')
      let update = await Token.findOneAndUpdate({_id: req.body._id}, {status_accept : true})
      console.log(update)
      return apiResponse.successResponseWithData(res, "Success", update)
    }
    catch (err){
      console.log(err)
      return  apiResponse.ErrorResponse(res, "false")
    }
  }
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

exports.getAcceptedToken = [
  async function (req, res) {
    const token = await Token.find({status_accept: true})
    if (token) {
      return apiResponse.successResponseWithData(res, "Token", token)
    }else {
      return apiResponse.ErrorResponse(res, "not found any tokens")
    }
  }
];

exports.getWaitingToken = [
  async function (req, res) {
    const token = await Token.find({status_accept: false})
    if (token) {
      return apiResponse.successResponseWithData(res, "Token", token)
    }else {
      return apiResponse.ErrorResponse(res, "not found any tokens")
    }
  }
];
