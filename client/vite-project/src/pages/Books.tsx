import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import bookStore from "../store/BookStore";
import BookAdmin from "../components/BookAdmin";

function Books() {
  const { books } = bookStore();

  const bookVariants = {
    initial: {
      opacity: 0.3,
      // scale: 0.95,
    },
    animate: (index: number) => ({
      opacity: 1,
      // scale: 1,

      transition: {
        delay: index * 0.1,
        duration: 1,
      },
    }),
  };

  return (
    <div className="py-12 px-8">
      <div className="flex justify-between w-full">
        <motion.h1
          initial="hidden"
          viewport={{ once: true }}
          whileInView="visible"
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          className=" text-4xl"
        >
          All Books
        </motion.h1>
        <motion.div
          initial="hidden"
          viewport={{ once: true }}
          whileInView="visible"
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          className="flex"
        >
          <form className="border-[1px] flex  border-slate-600 rounded-lg mr-2">
            <input
              type="text"
              placeholder="Search a book..."
              className=" w-[400px]  text-slate-200 bg-slate-950 px-1 py-2 mr-2 rounded-lg focus:outline-none text-lg"
            />
            <button className=" bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg h-full">
              <SearchIcon />
            </button>
          </form>
          <button className="bg-green-700 px-2 tex-md font-semibold rounded-lg hover:bg-green-800 duration-200">
            Create book
          </button>
        </motion.div>
      </div>

      {/**BOOK SECTION */}
      <div className="flex flex-wrap gap-3 mt-10">
        {books.map((book, index) => (
          <motion.div
            key={book.title}
            variants={bookVariants}
            initial="initial"
            whileInView={"animate"}
            viewport={{
              once: true,
            }}
            custom={index}
            className="basis-[20.33%]"
          >
            <BookAdmin book={book} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Books;
