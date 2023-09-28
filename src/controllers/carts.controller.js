import { cartsService, productsService, ticketsServices } from "../services/index.js";
import TicketsDTO from "../dtos/carts/TicketsDTO.js";
import ErrorService from "../services/ErrorService.js";
import EErrors from "../constants/EErrors.js";
import cartErrors from '../constants/carts.Errors.js';
import handleErrorResponse from "../middlewares/error.js";
import MailingService from "../services/MailingService.js";
import DTemplates from "../constants/DTemplates.js";

const getCarts = async (req, res) => {
  try {
    const carts = await cartsService.getAllCarts();
    res.status(200).send({ status: "success", payload: carts });
  } catch (error) {
    handleErrorResponse(error, req, res);
  }
}

const addCart = async (req, res) => {
  try {
    const { name, email } = req.body;
    //Verificando que el campo name se envie correctamente.
    if (!name || !email) {
      const error = ErrorService.createError({
        name: "Error de creacion del carrito",
        cause: cartErrors.cartErrorIncompleteValues({ name, email }),
        message: "El 'name' y el 'email' deben estar incluidos en el carrito",
        code: EErrors.INCOMPLETE_VALUES,
        status: 400
      })
    }

    //Verificando que el campo name sea de tipo string.
    if (typeof name !== 'string' || typeof email !== 'string') {
      const error = ErrorService.createError({
        name: "Error de creacion del carrito",
        cause: cartErrors.cartErrorInvalidTypes({ name, email }),
        message: "El 'name' y el 'email' deben ser de tipo 'String'",
        code: EErrors.INVALID_TYPES,
        status: 400
      })
    }

    //Verificando formato válido del correo electronico.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = ErrorService.createError({
        name: "Error de creacion del carrito",
        cause: cartErrors.cartInvalidEmail({ email }),
        message: "El correo electrónico debe tener un formato válido",
        code: EErrors.INVALID_TYPES,
        status: 400
      })
    }

    const existingCart = await cartsService.getCartBy({ email });
    if (existingCart) {
      const error = ErrorService.createError({
        name: "Error de creacion del carrito",
        cause: cartErrors.cartAlreadyExistError({ email }),
        message: "No se puede crear un carrito con el mismo correo electronico",
        code: EErrors.CART_ALREADY_EXIST,
        status: 400
      })
    }

    const newCart = await cartsService.createCart({ name, email });
    res.status(200).send({ status: "success", cart: newCart });

  } catch (error) {
    handleErrorResponse(error, req, res);
  }
}

const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartsService.getCartById(cartId).populate('products.product');
    if (cart) {
      res.send({ status: "success", message: `El cartito '${req.params.cid}' se ha cargado con exito`, payload: cart });
    } else {
      const error = ErrorService.createError({
        name: "Carrito no encontrado",
        cause: cartErrors.cartNotFound(cartId),
        message: "ingrese una Id valida",
        code: EErrors.CART_NOT_FOUND,
        status: 400
      })
    }
  } catch (error) {
    handleErrorResponse(error, req, res);
  }
}

const updateCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const updatedProducts = req.body.products;

    // Verificando si los productos existen en la base de datos
    const productIds = updatedProducts.map(product => product.product);
    const existingProducts = await productsService.getAllProducts({ _id: { $in: productIds } });

    // Validando si se encontraron todos los productos
    if (existingProducts.length !== productIds.length) {
      const missingProductIds = productIds.filter((productId) => !existingProducts.some((product) => product._id.toString() === productId));
      const error = ErrorService.createError({
        name: "ID's Inválidas",
        cause: cartErrors.invalidIds(missingProductIds),
        message: "Una o más ID's de productos no existen en la base de datos. Por favor, ingrese ID's válidas",
        code: EErrors.INVALID_TYPES,
        status: 400
      })
      return;
    }

    const updatedCart = await cartsService.updateCart(cartId, updatedProducts);

    res.status(200).send({ status: "success", message: `Carrito actualizado correctamente`, payload: updatedCart });
  } catch (error) {
    handleErrorResponse(error, req, res);
  }
}

const deleteAllProducts = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const deleteProducts = [];

    const deleteAllProducts = await cartsService.deleteAllProducts(cartId, deleteProducts);

    res.status(200).send({ status: "success", message: `Productos del carrito eliminados con éxito`, payload: deleteAllProducts });
  } catch (error) {
    handleErrorResponse(error, req, res);
  }
}

const addProductToCart = async (req, res) => {
  try {
    const cid = (req.params.cid);
    const pid = (req.params.pid);
    const quantity = (req.body.quantity);

    // Validando si el ID del producto es mayor que 0
    if (pid <= 0) {
      const error = ErrorService.createError({
        name: "Id Inválida",
        cause: cartErrors.invalidTypeWidouthPayload(),
        message: "El Id del producto debe ser mayor que 0.",
        code: EErrors.INVALID_TYPES,
        status: 400
      })
    }

    //Buscando el producto para verificar su dueño
    const product = await productsService.getProductById(pid);
    console.log(product);
    if (!product) {
      const error = ErrorService.createError({
        name: "Id Inválida",
        cause: cartErrors.invalidId(pid),
        message: "Producto no encontrado, por favor, ingrese una ID válida.",
        code: EErrors.INVALID_TYPES,
        status: 400
      })
    }

    //Verificando que el usuario premium no pueda agregar su propio producto al carrito

    if (req.user.role === "premium" && product.owner === req.user.email) {
      const error = ErrorService.createError({
        name: "Producto propio",
        cause: cartErrors.ownProductInCar(),
        message: "No puede agregar a su carrito un producto que le pertenece.",
        code: EErrors.INVALID_TYPES,
        status: 400
      })
    }

    const updatedCart = await cartsService.addProductToCart(cid, pid, quantity);
    if (updatedCart) {
      const newUpdatedCart = await cartsService.getCartById(cid);
      res.status(200).send({ status: "success", message: `Producto agregado correctamente al carrito '${req.params.cid}'`, payload: newUpdatedCart })
    } else {
      const error = ErrorService.createError({
        name: "Error interno del servidor",
        cause: cartErrors.internalServerError(),
        message: "No se ha procesado su solicitud",
        code: EErrors.INTERNAL_SERVER_ERROR,
        status: 500
      })
    }
  } catch (error) {
    handleErrorResponse(error, req, res);
  }
}

const updateProductQuantity = async (req, res) => {
  try {
    const cid = (req.params.cid);
    const pid = (req.params.pid);
    const quantity = (req.body.quantity);

    // Validando si el ID del producto es mayor que 0
    if (pid <= 0) {
      const error = ErrorService.createError({
        name: "Id Inválida",
        cause: cartErrors.invalidTypeWidouthPayload(),
        message: "El Id del producto debe ser mayor que 0.",
        code: EErrors.INVALID_TYPES,
        status: 400
      })
    }

    const validProduct = await productsService.getProductById(pid);
    if (!validProduct) {
      const error = ErrorService.createError({
        name: "Producto no encontrado",
        cause: cartErrors.productNotFound(pid),
        message: "El Id del producto debe ser válido.",
        code: EErrors.INVALID_TYPES,
        status: 400
      })
    }

    const validCart = await cartsService.getCartById(cid);
    if (!validCart) {
      const error = ErrorService.createError({
        name: "Carrito no encontrado",
        cause: cartErrors.cartNotFound(cid),
        message: "La Id del carrito debe ser válida.",
        code: EErrors.INVALID_TYPES,
        status: 400
      })
    }

    const updatedProductQuantity = await cartsService.updateProductQuantity(cid, pid, quantity);
    if (updatedProductQuantity) {
      const newUpdatedProductQuantity = await cartsService.getCartById(cid);
      res.status(200).send({ status: "success", message: `Cantidad actualizada correctamente`, payload: newUpdatedProductQuantity })
    } else {
      const error = ErrorService.createError({
        name: "Error interno del servidor",
        cause: cartErrors.internalServerError(),
        message: "No se ha procesado su solicitud",
        code: EErrors.INTERNAL_SERVER_ERROR,
        status: 500
      })
    }

  } catch (error) {
    handleErrorResponse(error, req, res);
  }
}

const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {

    const validProduct = await productsService.getProductById(pid);
    if (!validProduct) {
      const error = ErrorService.createError({
        name: "Producto no encontrado",
        cause: cartErrors.productNotFound(pid),
        message: "El Id del producto debe ser válido.",
        code: EErrors.INVALID_TYPES,
        status: 400
      })
    }

    const validCart = await cartsService.getCartById(cid);
    if (!validCart) {
      const error = ErrorService.createError({
        name: "Carrito no encontrado",
        cause: cartErrors.cartNotFound(cid),
        message: "La Id del carrito debe ser válida.",
        code: EErrors.INVALID_TYPES,
        status: 400
      })
    }

    // Verificar si el producto está en el carrito
    const cartWithProduct = await cartsService.getCartById(cid);
    if (!cartWithProduct || !cartWithProduct.products.find(product => product.product.toString() === pid.toString())) {
      const error = ErrorService.createError({
        name: "Producto no encontrado en el carrito",
        cause: cartErrors.productInCarNotFound(pid, cid),
        message: `No se encontró el producto.`,
        code: EErrors.INVALID_TYPES,
        status: 400
      });
    }

    const cart = await cartsService.deleteProductFromCart(cid, pid);

    // Consulta para obtener el título del producto eliminado
    const deleteProduct = await productsService.getProductById(pid);
    res.status(200).send({ status: "success", message: `El producto '${deleteProduct.title}' ha sido eliminado con exito`, payload: deleteProduct });

  } catch (error) {
    handleErrorResponse(error, req, res);
  }
}

const purchaseCart = async (req, res) => {
  const mailingService = new MailingService();

  try {
    const cartId = req.params.cid;
    const productsNotPurchased = [];

    // Obteniendo el carrito de la base de datos
    const cart = await cartsService.getCartById(cartId).populate('products.product');

    for (const item of cart.products) {
      const product = item.product;
      const quantityInCart = item.quantity;

      if (quantityInCart > product.stock) {
        // El producto no tiene suficiente stock
        productsNotPurchased.push(item.product._id);
      } else {
        // Restar la cantidad comprada del stock del producto
        product.stock -= quantityInCart;
        await product.save();
      }
    }

    if (cart.products.length === 0) {
      const error = ErrorService.createError({
        name: "Error al realizar la compra",
        cause: cartErrors.emptyCart(),
        message: `Carrito vacío`,
        code: EErrors.EMPTY_CART,
        status: 400
      });
    }

    // Crear un nuevo ticket con los datos de la compra
    const ticketDTO = new TicketsDTO.CreateTicketDTO(cart);
    const newTicket = { ...ticketDTO }

    // Utilizar el servicio de Tickets para generar el ticket
    const createdTicket = await ticketsServices.createTicket(newTicket);

    //Creo un nuevo objeto solamente con los datos necesarios para enviar el correo electronico.
    const userData = {
      name: req.user.name
    }
    const ticketData = {
      code: createdTicket.code,
      purchase_datetime: createdTicket.purchase_datetime,
      amount: createdTicket.amount,
      purchaser: createdTicket.purchaser,
    }

    //Nuevo objeto payload que se pasa por data para la plantilla de handlebars
    const payload = {
      ...userData,
      ...ticketData
    };

    //Envio un correo electronico al usuario con los datos de su ticket
    await mailingService.sendMail(req.user.email, DTemplates.TICKET, {data: payload});

    // Actualizar el estado del carrito y los productos no comprados
    cart.products = cart.products.filter((item) => !productsNotPurchased.includes(item._id));
    cart.status = 'completed';
    await cart.save();

    // Responder con el ticket y los productos no comprados
    if (productsNotPurchased.length > 0) {
      // Hay productos que no pudieron comprarse
      const error = ErrorService.createError({
        name: "Error al realizar la compra",
        cause: cartErrors.noStock(productsNotPurchased),
        message: `Falta de stock`,
        code: EErrors.NO_STOCK,
        status: 400
      });
    } else {
      // Todos los productos se compraron con éxito
      return res.send({ status: "success", message: "Su compra se ha realizado con éxito", ticket: createdTicket });
    }
  } catch (error) {
    handleErrorResponse(error, req, res);
  }
}

export default {
  getCarts,
  addCart,
  getCartById,
  updateCart,
  deleteAllProducts,
  addProductToCart,
  updateProductQuantity,
  deleteProductFromCart,
  purchaseCart
}