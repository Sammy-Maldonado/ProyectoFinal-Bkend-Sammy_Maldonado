//EErrors (Enum error o enumeración de posibles errores que vayan a ocurrir)
const EErrors = {
    INCOMPLETE_VALUES: 1, //Cuando no vengan los valores requeridos en la petición.
    INVALID_TYPES: 2, //Cuando los valores requeridos no sean válidos.
    CART_ALREADY_EXIST: 3,  //Cuando el correo electronico para la creacion del carrito esta repetido.
    CART_NOT_FOUND: 4,  //El carrito no se encuentra en la base de datos
    EMPTY_CART: 5,   //Carrito vacío
    PRODUCT_ALREADY_EXIST: 6,  //Cuando el codigo del producto esté repetido.
    NO_STOCK: 7,   //No hay stock del producto solicitado para la venta.
    INTERNAL_SERVER_ERROR: 8,  //Cuando haya un error interno del servidor.
    PRRODUCT_NOT_FOUND: 9 //No se encontró el producto
  } 
  
  export default EErrors