import express from "express";
import {
  deleteProduct,
  exchangedProduct,
  getAllProduct,
  getOneProduct,
  postLike,
  postProduct,
  putProduct,
  searchProduct,
} from "../controllers/productController";

import { upload } from "../middleware/upload";
const productRouter = express.Router();

productRouter.route("/list").get(getAllProduct);

productRouter.route("/post").post(upload.array("file"), postProduct);

productRouter
  .route("/:id(\\d+)")
  .post(postLike)
  .get(getOneProduct)
  .put(upload.array("file"), putProduct)
  .delete(deleteProduct);

productRouter.route("/search").get(searchProduct);

productRouter.route("/exchange/:id(\\d+)").put(exchangedProduct);
export default productRouter;