import "dotenv/config";
import { createApp } from "./app.js";
import { BooksModel } from "./models/supabase/book.js";

createApp({ bookModel: BooksModel });
