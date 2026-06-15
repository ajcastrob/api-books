import { createApp } from "./app.js";
import { BooksModel } from "./models/mysql/book.js";

createApp({ bookModel: BooksModel });
