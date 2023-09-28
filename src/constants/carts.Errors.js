const cartErrorIncompleteValues = (cart) => {
    //Devuelvo toda una string con la explicación de que está pasando
    return `Uno o más parámetros obligatorios no fueron proporcionados correctamente:

    Propiedades obligatorias:
    * name: se esperaba una cadena definida, y se recibió '${cart.name}',
    * email: se esperaba una cadena definida, y se recibió '${cart.email}'
    `
  }
  
const cartErrorInvalidTypes = (cart) => {
    //Devuelvo toda una string con la explicación de que está pasando
    return `Uno o más parámetros obligatorios no fueron proporcionados correctamente:

    Propiedades obligatorias:
    * name: se esperaba una cadena de caracteres, y se recibió '${typeof cart.name === "string" ? 'correcamente' : typeof cart.name}',
    * email: se esperaba una cadena de caracteres, y se recibió '${typeof cart.email === "string" ? 'correctamente' : typeof cart.email}',
    `
  }

const cartInvalidEmail = (cart) => {
    return `Uno o más parámetros obligatorios no fueron proporcionados correctamente:

    Propiedades obligatorias:
    * email: se esperaba una dirección de correo electrónico válida en el formato 'usuario@ejemplo.com', y se recibió '${cart.email}',
    `
  }
  
const cartAlreadyExistError = (cart) => {
    return `El correo electronico '${cart.email}' ya está vinculado a un carrito existente.
    `
  }
  
const cartNotFound = (cid) => {
    return `No fue posible encontrar el carrito '${cid}' especificado en la base de datos, por favor, ingrese una id válida.`
  }

const invalidIds = (missingIds) => {
    const missingIdsString = missingIds.map((id) => `'${id}'`).join(', ');
    return `No fue posible encontrar las siguientes ID's de productos: ${missingIdsString}`;
  }

const invalidId = (missingId) => {
    return `No fue posible encontrar el producto: '${missingId}'`;
  }

const internalServerError = () => {
    return `Se ha producido un error interno en el servidor, por favor, infórmelo e intente su petición más tarde.`
  }

const invalidTypeWidouthPayload = (cart) => {
    //Devuelvo toda una string con la explicación de que está pasando
    return `El Id del producto debe ser mayor que 0`
  }

const ownProductInCar = (cart) => {
    return `Para prevenir estafas, no puede agregar un producto que ha creado a su carrito.`
  }

const productNotFound = (pid) => {
    return `El producto solicitado '${pid}' no se encuentra en la base de datos.`
  }

const productInCarNotFound = (pid, cid) => {
    return `El producto con ID '${pid}' no se encuentra en el carrito con ID '${cid}'.`
  }

const emptyCart = () => {
    return `Su carrito está vacío. Por favor, ingrese al menos un producto para realizar su compra.`
  }

const noStock = (productsNotPurchased) => {
    const missingProducts = productsNotPurchased.map((id) => `'${id}'`).join(', ');
    return `No se pudo realizar su compra por falta de stock en los siguientes productos: ${missingProducts}`
  }

export default {
    cartErrorIncompleteValues,
    cartErrorInvalidTypes,
    cartInvalidEmail,
    cartAlreadyExistError,
    cartNotFound,
    invalidIds,
    invalidId,
    internalServerError,
    invalidTypeWidouthPayload,
    ownProductInCar,
    productNotFound,
    productInCarNotFound,
    emptyCart,
    noStock
  }