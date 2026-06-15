import { Router } from "express";
import { BooksController } from "../controllers/books.js";

export const createBookRouter = ({ bookModel }) => {
  const booksRouter = Router();

  const bookController = new BooksController({ bookModel });

  booksRouter.get("/", bookController.getAll);

  booksRouter.get("/:slug", bookController.getBySlug);

  booksRouter.post("/", bookController.createBook);

  booksRouter.delete("/:id", bookController.deleteBook);

  booksRouter.patch("/:id", bookController.updateBook);

  return booksRouter;
};
