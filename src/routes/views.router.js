import { Router } from "express";
import viewsController from "../controllers/views.controller.js";
import { authRoles, authNotLogged, passportCall } from "../services/auth.js";

const router = Router();

/* MongoDb */

router.get('/', passportCall('jwt', { strategyType: 'jwt', sessions: false }), viewsController.getProducts);
router.get('/carts', passportCall('jwt', { strategyType: 'jwt', sessions: false }), authRoles("user"), viewsController.getCarts);
router.get('/chat', passportCall('jwt', { strategyType: 'jwt', sessions: false }), authRoles("user"), viewsController.chat);
router.get('/products', passportCall('jwt', { strategyType: 'jwt', sessions: false }), viewsController.addPaginate);
router.get('/register', passportCall('jwt', { strategyType: 'jwt', sessions: false, redirect: '/products' }), viewsController.register);
router.get('/login', passportCall('jwt', { strategyType: 'jwt', sessions: false, redirect: '/products' }), viewsController.login);
router.get('/profile', passportCall('jwt', { strategyType: 'jwt', sessions: false }), viewsController.profile);
router.get('/products/:id', viewsController.getProductById);
router.get('/carts/:cid', viewsController.getCartById);
router.get('/restoreRequest', passportCall('jwt', { strategyType: 'jwt', sessions: false}), authNotLogged, viewsController.restoreRequest);
router.get('/restorePassword', passportCall('jwt', { strategyType: 'jwt', sessions: false }), authNotLogged, viewsController.restorePassword);

export default router;