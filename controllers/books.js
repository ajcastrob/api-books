import { validateSchema, validatePartialSchema } from "../schema/books.js";

const notFound = (res, message) => {
  return res.status(404).json({ error: message });
};

export class BooksController {
  constructor({ bookModel }) {
    this.bookModel = bookModel;
  }

  getAll = async (req, res) => {
    const { genre } = req.query;
    const books = await this.bookModel.getAll({ genre });

    res.status(200).json(books);
  };

  getBySlug = async (req, res) => {
    const { slug } = req.params;

    const book = await this.bookModel.getBySlug({ slug });

    if (!book) {
      return notFound(res, "book not found");
    }

    res.status(200).json(book);
  };

  createBook = async (req, res) => {
    const info = req.body;
    const result = validateSchema(info);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newBook = await this.bookModel.createBook({ info: result.data });

    res.status(201).json(newBook);
  };

  deleteBook = async (req, res) => {
    const { id } = req.params;

    const bookIndex = await this.bookModel.deleteBook({ id });

    if (!bookIndex) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({ message: `Book with id ${id} deleted` });
  };

  updateBook = async (req, res) => {
    const { id } = req.params;
    const result = validatePartialSchema(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const book = await this.bookModel.updateBook({ id, info: result.data });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  };
}
