import { useEffect, useState } from "react";
import Book from "../components/Book";
import bookStore from "../store/BookStore";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
// import "./bookFiles.css";

type BooksType = {
  _id: string;
  title: string;
  img: string;
  featured: boolean;
  likedBy?: string[];
  borrowedBy?: { user: string; name?: string; returnedBy?: string }[];
  quantity: number;
};

function Books() {
  const [viewAll, setViewAll] = useState(false);
  const [emptyBook, setIsEmptyBook] = useState(false);
  const [searchBook, setSearchBook] = useState("");
  const [bookSearched, setBookSearched] = useState<BooksType[]>([]);

  const { books } = bookStore();
  const [booksView, setBooksView] = useState<BooksType[]>([]);

  console.log("Home books", books);
  // console.log(books);

  const handleViewAll = () => {
    setViewAll((prev) => !prev);
  };

  const handleSearchBook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const book = booksView.filter((item) => {
      if (item.title.toUpperCase().includes(searchBook.toUpperCase())) {
        return item;
      }
    });

    if (book.length === 0) {
      setIsEmptyBook(true);
    } else {
      setBookSearched(book);
      setIsEmptyBook(false);
    }
  };

  useEffect(() => {
    if (searchBook.trim().length === 0) {
      // setViewAll(true);
      setBookSearched([]);
      setIsEmptyBook(false);
    }
  }, [searchBook]);

  useEffect(() => {
    if (viewAll) {
      setBooksView(books);
    } else {
      setBooksView(books.slice(0, 4));
    }
    setIsEmptyBook(false);
    setSearchBook("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewAll, books]);

  console.log("Books in view are:", booksView, viewAll);

  return (
    <section id="Books" className=" mb-32">
      <div className="mb-2 flex justify-between w-full">
        <motion.h1
          initial="hidden"
          viewport={{ once: true }}
          whileInView="visible"
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0, x: -100 },
            visible: { opacity: 1, x: 0 },
          }}
          className="text-5xl "
        >
          All Books
        </motion.h1>
        <motion.div
          initial="hidden"
          viewport={{ once: true }}
          whileInView="visible"
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0, x: 100 },
            visible: { opacity: 1, x: 0 },
          }}
          className="flex justify-between"
        >
          <form
            onSubmit={handleSearchBook}
            className="border-[1px]  rounded-lg mr-2"
          >
            <input
              type="text"
              onChange={(e) => setSearchBook(e.target.value)}
              value={searchBook}
              placeholder="Search a book..."
              className=" w-[400px] px-1 py-2 mr-2 rounded-lg focus:outline-none text-lg"
            />
            <button className=" bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg h-full">
              <SearchIcon />
            </button>
          </form>
          {books.length > 4 && (
            <button
              onClick={handleViewAll}
              className="text-slate-500 text-lg font-bold underline hover:text-blue-600"
            >
              {viewAll ? "Show less" : "View All"}...
            </button>
          )}
        </motion.div>
      </div>

      <hr className="mb-8" />

      {/**BOOK */}
      <motion.div
        initial="hidden"
        viewport={{ once: true }}
        whileInView="visible"
        transition={{ duration: 1 }}
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 },
        }}
        className="flex flex-wrap gap-1 max-h-[800px] overflow-y-auto"
      >
        {emptyBook ? (
          <h1 className="text-5xl text-slate-500 text-center  w-full">
            Book not found...
          </h1>
        ) : bookSearched.length > 0 ? (
          bookSearched.map((book) => <Book key={book.title} book={book} />)
        ) : (
          booksView.map((book) => <Book key={book.title} book={book} />)
        )}
      </motion.div>
    </section>
  );
}

export default Books;
