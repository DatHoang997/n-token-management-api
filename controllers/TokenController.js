const Token = require("../models/TokenModel")
const Network = require("../models/NetworkModel")
const { body, validationResult } = require("express-validator")
const apiResponse = require("../helpers/apiResponse")
var mongoose = require("mongoose")
const auth = require("../middlewares/jwt")
const admin = require("../middlewares/admin")

var upload = require('../helpers/upload')

mongoose.set("useFindAndModify", false)

exports.saveToken = [
  auth,
  upload.array('files'),
  body("name", "name can not be empty.").notEmpty().trim(),
  body("network", "network can not be empty.").notEmpty().trim(),
  body("symbol", "symbol can not be empty.").notEmpty().trim(),
  body("decimal", "decimal can not be empty.").notEmpty().trim(),
  async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
    }
    let saved = await Token.findOne({name: req.body.name})
    if (!saved && !req.body.segWit) {
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
        accept_status: false
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
        accept_status: false
      })
      token.save()
      return apiResponse.successResponseWithData(res, "Success", token)
    } else {
      return  apiResponse.ErrorResponse(res, "false")
    }
  }
];

exports.editToken = [
  auth,
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
      return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
    }
    try {
      if (!req.body.segWit) {
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
      return  apiResponse.ErrorResponse(res, "false")
    }
  }
];

exports.acceptToken = [
  auth,
  admin,
  upload.array('files'),
  body("_id", "id can not be empty.").notEmpty().trim(),
  async function (req, res) {
    console.log(req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
    }
    try {
      let update = await Token.findOneAndUpdate({_id: req.body._id}, {accept_status: true})
      return apiResponse.successResponseWithData(res, "Success", update)
    }
    catch (err){
      return  apiResponse.ErrorResponse(res, "false")
    }
  }
];

exports.deleteToken = [
  auth,
  admin,
  async function (req, res) {
    let id = await req.params._id
    Token.findByIdAndRemove(id, function (err) {
      if (err) {
        return apiResponse.ErrorResponse(res, err)
      }else{
        return apiResponse.successResponse(res,"Token delete Success.")
      }
    })
  }
];

exports.getToken = [
  auth,
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
    if (token) {
      for (let i = 0; i < token.length; i++) {
        const network = await Network.findOne({networks: token[i].network})
        arr.push({
          network: network.networks,
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
    if (token) {
      for (let i = 0; i < token.length; i++) {
        const network = await Network.findOne({networks: token[i].network})
        arr.push({
          network: network.networks,
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
  auth,
  async function (req, res) {
    const token = await Token.find({accept_status: true})
    let data = []
    for (let i = 0; i < token.length; i++) {
      const network = await Network.findOne({networks: token[i].network})
      console.log(network)
      data.push({
        _id: token[i]._id,
        name: token[i].name,
        network: token[i].network,
        symbol: token[i].symbol,
        decimal: token[i].decimal,
        cmcId: token[i].cmcId,
        cgkId: token[i].cgkId,
        apiSymbol: token[i].apiSymbol,
        chainType: token[i].chainType,
        address: token[i].address,
        logo: token[i].logo,
        format_address: token[i].format_address,
        segWit: token[i].segWit,
        explorer: network.explorer
      })
    }
    if (token) {
      return apiResponse.successResponseWithData(res, "Token", data)
    }else {
      return apiResponse.ErrorResponse(res, "not found any tokens")
    }
  }
];

exports.getWaitingToken = [
  auth,
  async function (req, res) {
    const token = await Token.find({accept_status: false})
    let data = []
    for (let i = 0; i < token.length; i++) {
      const network = await Network.findOne({networks: token[i].network})
      data.push({
        _id: token[i]._id,
        name: token[i].name,
        network: token[i].network,
        symbol: token[i].symbol,
        decimal: token[i].decimal,
        cmcId: token[i].cmcId,
        cgkId: token[i].cgkId,
        apiSymbol: token[i].apiSymbol,
        chainType: token[i].chainType,
        address: token[i].address,
        logo: token[i].logo,
        format_address: token[i].format_address,
        segWit: token[i].segWit,
        explorer: network.explorer
      })
    }
    if (token) {
      return apiResponse.successResponseWithData(res, "Token", data)
    }else {
      return apiResponse.ErrorResponse(res, "not found any tokens")
    }
  }
];

exports.saveNetwork = [
  auth,
  upload.array('files'),
  body("explorer", "explorer can not be empty.").notEmpty().trim(),
  body("network", "network can not be empty.").notEmpty().trim(),
  async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
    }
    let saved = await Network.findOne({name: req.body.network})
    if (!saved) {
      let network = new Network({
        networks: req.body.network,
        explorer: req.body.explorer
      })
      network.save()
      return apiResponse.successResponseWithData(res, "Success", network)
    }
  }
];

exports.editNetwork = [
  auth,
  upload.array('files'),
  body("explorer", "explorer can not be empty.").notEmpty().trim(),
  body("network", "network can not be empty.").notEmpty().trim(),
  async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
    }
    try {
      let update = await Network.findOneAndUpdate({
        _id: req.body._id
      }, {
        networks: req.body.network,
        explorer: req.body.explorer
      })
      return apiResponse.successResponseWithData(res, "Success", update)
    }
    catch (err){
      return  apiResponse.ErrorResponse(res, "false")
    }
  }
];

exports.deleteNetwork = [
  auth,
  admin,
  async function (req, res) {
    let id = await req.params._id
    Network.findByIdAndRemove(id, function (err) {
      if (err) {
        return apiResponse.ErrorResponse(res, err)
      }else{
        return apiResponse.successResponse(res,"Network delete Success.")
      }
    })
  }
];

exports.getNetwork = [
  auth,
  async function (req, res) {
    const network = await Network.find()
    if (network) {
      return apiResponse.successResponseWithData(res, "Network", network)
    }else {
      return apiResponse.ErrorResponse(res, "not found any networks")
    }
  }
];
