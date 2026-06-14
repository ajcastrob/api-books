import { validateSchema, validatePartialSchema } from "../schema/books.js";
// import { BooksModel } from "../models/books.js";
import { BooksModel } from "../models/mysql/book.js";

const notFound = (res, message) => {
  return res.status(404).json({ error: message });
};

export class BooksController {
  static getAll = async (req, res) => {
    const { genre } = req.query;
    const books = await BooksModel.getAll({ genre });

    res.status(200).json(books);
  };

  static getBySlug = async (req, res) => {
    const { slug } = req.params;

    const book = await BooksModel.getBySlug({ slug });

    if (!book) {
      return notFound(res, "book not found");
    }

    res.status(200).json(book);
  };

  static createBook = async (req, res) => {
    const info = req.body;
    const result = validateSchema(info);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newBook = await BooksModel.createBook({ info: result.data });

    res.status(201).json(newBook);
  };

  static deleteBook = async (req, res) => {
    const { id } = req.params;

    const bookIndex = await BooksModel.deleteBook({ id });

    if (!bookIndex) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({ message: `Book with id ${id} deleted` });
  };

  static updateBook = async (req, res) => {
    const { id } = req.params;
    const result = validatePartialSchema(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const book = await BooksModel.updateBook({ id, info: result.data });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  };
}
