import bcrypt from 'bcrypt'
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const createHash = async (password) => {
  const salts = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salts);
}

export const validatePassword = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

//1ro passport autoriza la autenticación
export const passportCall = (strategy, options = {}) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) return next(error);
      if (!options.strategyType) {
        console.log(`La ruta ${req.url} no tiene Tipo de Estrategia (strategyType) definida`);
        return res.sendServerError();
      }
      if (!user) {
        switch(options.strategyType) {
          case 'jwt':
            req.error = info.message ? info.message : info.toString;
            return next();
          case 'locals':
            return res.sendUnauthorized(info.message ? info.message : info.toString())
        }
      }
      if (user) {
        switch (options.strategyType) {
          case 'jwt':
            if (options.redirect) return res.redirect(options.redirect);
        }
      }
      req.user = user;  //Aqui creo mi propio "req.user" con passport
      next();
    })(req, res, next);
  }
}

/* Aqui le genero el token al usuario autenticado que me llego arriba. Esta funcion es usada en -> sessions.router (ver) */
export const generateToken = (user, expiresIn='1d') => {
  return jwt.sign(user, config.jwt.SECRET, {expiresIn});
}

export const authRoles = (roles) => {
  //Si llegué a este punto, es porque TENGO un usuario creado
  return async (req, res, next) => {
    if (roles.includes(req.user.role)) {
      // Permitir acceso para usuarios con los roles especificados
      return next();
    }
    return res.status(403).send({ status: "error", error: "Acceso Denegado" })
  }
}

export const authNotLogged = (req, res, next) => {
  if(req.user) {
    return res.status(403).send({ status: "error", error: "Acceso Denegado" })
  }
  next();
};