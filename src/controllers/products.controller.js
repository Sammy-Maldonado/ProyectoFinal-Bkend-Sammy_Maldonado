import { productsService } from "../services/index.js";
import ProductsDTO from "../dtos/product/ProductsDTO.js";
import __dirname from "../utils.js";
import productErrors from "../constants/products.Errors.js";
import handleErrorResponse from "../middlewares/error.js";
import EErrors from "../constants/EErrors.js";
import ErrorService from "../services/ErrorService.js";

const getProducts = async (req, res) => {
  try {
    const { page = 1, category } = req.query;
    const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } = await productsService.addPaginate(
      { /* category: "frutas" */ },
      {
        page, limit: 5,
        lean: true,
        sort: { price: 1 }
      });
    const products = docs

    const totalPages = rest.totalPages;
    const prevLink = hasPrevPage ? `/api/products?page=${prevPage}` : null;
    const nextLink = hasNextPage ? `/api/products?page=${nextPage}` : null;

    const paginateDTO = new ProductsDTO.GetProductsDTO(products, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink)
    const result = { ...paginateDTO }
    res.send(result);

  } catch (error) {
    handleErrorResponse(error, req, res);
  }
}

const addProduct = async (req, res) => {
  try {
    const { title, description, price, code, stock, category, thumbnails } = req.body;
    const productWithCode = await productsService.getOneProduct({ code })

    //Comprobando que no falten datos o que no esten vacíos

    if (!title || !description || !price || !code || !stock || !category || !thumbnails) {
      const error = ErrorService.createError({
        name: "Error de creacion del producto",
        cause: productErrors.productErrorIncompleteValues({ title, description, price, code, stock, category, thumbnails }),
        message: "Todos los datos deben estar incluidos para crear el producto.",
        code: EErrors.INCOMPLETE_VALUES,
        status: 400
      })
    }

    const existingProduct = productWithCode;
    if (existingProduct) {
      const error = ErrorService.createError({
        name: "Error de creacion del producto",
        cause: productErrors.productAlreadyExistError(existingProduct),
        message: "El código de producto ya está en uso.",
        code: EErrors.PRODUCT_ALREADY_EXIST,
        status: 400
      })
    }

    //Obtengo los datos del usuario para vincularlo como owner
    const user = req.user;

    const productDTO = new ProductsDTO.CreateProductDTO(req.body, user);
    const product = { ...productDTO };

    const result = await productsService.createProduct(product);
    res.send({ status: "success", message: "Producto agregado correctamente", payload: result });
  } catch (error) {
    handleErrorResponse(error, req, res);
  }
}

const getProductById = async (req, res) => {
  try {
    const productId = req.params.pId;
    const product = await productsService.getProductById(productId);
    if (product) {
      res.send({ status: "success", message: `El producto '${product.title}', se ha cargado correctamente`, payload: product });
    } else {
      const error = ErrorService.createError({
        name: "Error al buscar el producto",
        cause: productErrors.productNotFound(productId),
        message: "Producto no encontrado, intente otro código.",
        code: EErrors.PRRODUCT_NOT_FOUND,
        status: 404
      })
    }
  } catch (error) {
    handleErrorResponse(error, req, res);
  }
}

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.pId;
    const productToUpdate = req.body;

    //Verificando que el producto exista en la base de datos
    const productExists = await productsService.getProductById(productId);
    if (!productExists) {
      const error = ErrorService.createError({
        name: "Error al buscar el producto",
        cause: productErrors.productNotFound(productId),
        message: "Producto no encontrado, intente otro código.",
        code: EErrors.PRRODUCT_NOT_FOUND,
        status: 404
      })
    }

    const result = await productsService.updateProduct(productId, productToUpdate)
    const newProduct = await productsService.getProductById(productId)
    console.log(result);
    res.send({ status: "success", message: "Producto actualizado con éxito", payload: newProduct })
  } catch (error) {
    handleErrorResponse(error, req, res);
  }
}

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.pId;

    const productToDelete = await productsService.getProductById(productId);
    if (!productToDelete) {
      const error = ErrorService.createError({
        name: "Error al buscar el producto",
        cause: productErrors.productNotFound(productId),
        message: "Producto no encontrado, intente otro código.",
        code: EErrors.PRRODUCT_NOT_FOUND,
        status: 404
      })
    }

    //Verificando que el "admin" pueda borrar cualquier producto aunque no sea owner y que el usuario premium solo pueda borrar los productos que le pertenecen

    if (req.user.role === "admin" || (req.user.role === "premium" && productToDelete.owner === req.user.email)) {
      const deletedProduct = await productsService.getProductById(productId);
      const result = await productsService.deleteProduct(productId);
      console.log(result);
      res.send({ status: "success", message: "Su producto ha sido eliminado con éxito", payload: deletedProduct })
    } else {
      const error = ErrorService.createError({
        name: "Error de autorización",
        cause: productErrors.noAuth(),
        message: "Acceso Denegado.",
        code: EErrors.PRRODUCT_NOT_FOUND,
        status: 403
      })
      return res.status(403).send({ status: "error", error: "Acceso Denegado" });
    }
  } catch (error) {
    handleErrorResponse(error, req, res);
  }
}

const createProductWithImage = async (req, res) => {
  try {
    const file = req.file;
    const folder = "products"
    const { title, description, price, code, stock, category} = req.body;

    if (!title || !description || !price || !code || !stock || !category || !file) {
      const error = ErrorService.createError({
        name: "Error de creacion del producto",
        cause: productErrors.productErrorWithImageIncompleteValues({ title, description, price, code, stock, category}, file),
        message: "Todos los datos deben estar incluidos para crear el producto.",
        code: EErrors.INCOMPLETE_VALUES,
        status: 400
      })
    }

    const productDTO = new ProductsDTO.CreateProductWithImageDTO(req.body, file, folder);
    const product = { ...productDTO };
    const result = await productsService.createProduct(product);
    res.send({ status: "success", message: `Su producto '${product.title}' ha sido creado con exito`, payload: result });
  } catch (error) {
    handleErrorResponse(error, req, res);
  }

}

export default {
  getProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductWithImage
}