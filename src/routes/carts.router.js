import { Router } from "express";
import cartsController from "../controllers/carts.controller.js";
import { passportCall } from "../services/auth.js";
import attachLogger from "../middlewares/logger.js";

const router = Router();

/* MongoDB */
router.get('/',attachLogger, passportCall('jwt', { strategyType: 'jwt', session: false }), cartsController.getCarts);
router.post('/',attachLogger, passportCall('jwt', { strategyType: 'jwt', session: false }), cartsController.addCart);
router.get('/:cid',attachLogger, passportCall('jwt', { strategyType: 'jwt', session: false }), cartsController.getCartById);
router.put('/:cid',attachLogger, passportCall('jwt', { strategyType: 'jwt', session: false }), cartsController.updateCart);
router.delete('/:cid',attachLogger, passportCall('jwt', { strategyType: 'jwt', session: false }), cartsController.deleteAllProducts);
router.post('/:cid/product/:pid',attachLogger, passportCall('jwt', { strategyType: 'jwt', sessions: false }), cartsController.addProductToCart);
router.put('/:cid/product/:pid',attachLogger, passportCall('jwt', { strategyType: 'jwt', session: false }), cartsController.updateProductQuantity);
router.delete('/:cid/product/:pid',attachLogger, passportCall('jwt', { strategyType: 'jwt', session: false }), cartsController.deleteProductFromCart);
router.post('/:cid/purchase',attachLogger, passportCall('jwt', { strategyType: 'jwt', session: false }), cartsController.purchaseCart);

export default router;