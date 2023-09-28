import { Router } from "express";
import { passportCall } from "../services/auth.js";
import attachLogger from "../middlewares/logger.js";

export default class BaseRouter {
  constructor() {
    this.router = Router();
    this.init();
  }

  init() { }

  getRouter = () => this.router;

  get(path, policies, ...callbacks) {
    this.router.get(path, attachLogger, passportCall('jwt', { strategyType: 'jwt' }), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
  }

  post(path, policies, ...callbacks) {
    this.router.post(path, attachLogger, passportCall('jwt', { strategyType: 'jwt' }), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));

  }
  put(path, policies, ...callbacks) {
    this.router.put(path, attachLogger, passportCall('jwt', { strategyType: 'jwt' }), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(path, attachLogger, passportCall('jwt', { strategyType: 'jwt' }), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
  }

  generateCustomResponses = (req, res, next) => {
    res.sendSuccess = message => res.send({ status: "success", message });
    res.sendSuccessWithPayload = payload => res.send({ status: "success", payload });
    res.sendInternalError = error => res.status(500).send({ status: "error", error });
    res.sendBadRequest = error => res.status(400).send({ status: "error", error });
    res.sendUnauthorized = error => res.status(401).send({ status: "error", error });
    res.sendForbidden = error => res.status(403).send({status:"error", error});
    next();
  }

  handlePolicies = policies => {
    return (req, res, next) => {
      if (policies[0] === "PUBLIC") return next();
      //En este punto ya deberiamos tenemos al usuario parseado desde jwt
      const user = req.user;
      if (policies[0] === "NO_AUTH" && user) return res.status(401).send({ status: "error", error: "No autorizado" });
      if (policies[0] === "NO_AUTH" && !user) return next();
      //A partir de aquí, si me interesa que exista un usuario.
      if (!user) return res.status(401).send({ status: "error", error: req.error });
      if (!policies.includes(user.role.toUpperCase())) return res.status(403).send({ status: "error", error: "Acceso denegado" });
      
      next();
    }
  }

  applyCallbacks(callbacks) {
    return callbacks.map(callback => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        params[1].sendInternalError(error);
      }
    })
  }
}