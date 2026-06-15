import { createApp } from "./app.js";
import { BooksModel } from "./models/file-system/books.js";

createApp({ bookModel: BooksModel });
