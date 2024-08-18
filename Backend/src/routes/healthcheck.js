const healthCheck = require("../controllers/healthcheck_Controller");
const verifyJWT = require("../middleware/authorize");
const express = require("express");
const healthRouter = express.Router();

healthRouter.use(verifyJWT);

healthRouter.route("/").get(healthCheck)

module.exports = healthRouter;