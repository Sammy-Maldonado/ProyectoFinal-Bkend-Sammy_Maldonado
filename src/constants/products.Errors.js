const productErrorIncompleteValues = (product) => {
  //Devuelvo toda una string con la explicación de que está pasando
  return `Uno o más parámetros obligatorios no fueron proporcionados correctamente:

    Propiedades obligatorias:
    * title: se esperaba una cadena definida, y se recibió '${product.title ? 'correctamente' : product.title = "undefined"}',
    * description: se esperaba una cadena definida, y se recibió '${product.description ? 'correctamente' : product.description = "undefined"}',
    * price: se esperaba un number, y se recibió '${product.price ? 'correctamente' : product.price = "undefined"}',
    * code: se esperaba una cadena definida, y se recibió '${product.code ? 'correctamente' : product.code = "undefined"}',
    * stock: se esperaba un number, y se recibió '${product.stock ? 'correctamente' : product.stock = "undefined"}',
    * category: se esperaba una cadena definida, y se recibió '${product.category ? 'correctamente' : product.category = "undefined"}',
    * thumbnails: se esperaba una cadena definida, y se recibió '${product.thumbnails ? 'correctamente' : product.thumbnails = "undefined"}'
    `
}

const productErrorWithImageIncompleteValues = (product, file) => {
  
  //Devuelvo toda una string con la explicación de que está pasando
  return `Uno o más parámetros obligatorios no fueron proporcionados correctamente:

    Propiedades obligatorias:
    * title: se esperaba una cadena definida, y se recibió '${product.title ? 'correctamente' : "undefined"}',
    * description: se esperaba una cadena definida, y se recibió '${product.description ? 'correctamente' : "undefined"}',
    * price: se esperaba un number, y se recibió '${product.price ? 'correctamente' : "undefined"}',
    * code: se esperaba una cadena definida, y se recibió '${product.code ? 'correctamente' : "undefined"}',
    * stock: se esperaba un number, y se recibió '${product.stock ? 'correctamente' : "undefined"}',
    * category: se esperaba una cadena definida, y se recibió '${product.category ? 'correctamente' : "undefined"}',
    * thumbnails: se esperaba una cadena definida, y se recibió '${file ? 'correctamente' : 'undefined'}'
    `
}

const productErrorInvalidTypes = (product) => {
  //Devuelvo toda una string con la explicación de que está pasando
  return `Uno o más parámetros obligatorios no fueron proporcionados correctamente:
    Propiedades obligatorias:
    * title: se esperaba una cadena de caracteres, y se recibió '${typeof product.title}',
    * description: se esperaba una cadena de caracteres, y se recibió '${typeof product.description}',
    * price: se esperaba un número no negativo, y se recibió '${typeof product.price === "number" ? product.price : "caracter inválido"}',
    * department: se esperaba una cadena de caracteres, y se recibió '${typeof product.department}',
    * stock: se esperaba un número no negativo y entero, y se recibió '${typeof product.stock === "number" ? product.stock : "caracter inválido"}',
    * code: se esperaba una cadena de caracteres, y se recibió '${typeof product.code}',
    `
}

const productAlreadyExistError = (product) => {
  return `El código del producto que se ha proporcionado, actualmente está en uso.

    Propiedad obligatoria:
    * code: se esperaba una nueva cadena de caracteres, pero se repitió '${product.code}'
    `
}

const productNotFound = (pid) => {
  return `No fue posible encontrar el producto '${pid}' especificado en la base de datos, por favor, ingrese una id válida.`
}


const internalServerError = () => {
  return `Se ha producido un error interno en el servidor, por favor, infórmelo e intente su petición más tarde.`
}

const noAuth = () => {
  return `No esta autorizado para realizar esta accion. Pida los permisos correspondientes al administrador.`
}

export default {
  productErrorIncompleteValues,
  productErrorInvalidTypes,
  productAlreadyExistError,
  internalServerError,
  productNotFound,
  noAuth,
  productErrorWithImageIncompleteValues
}