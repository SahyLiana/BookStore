import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import bookStore from "../store/BookStore";
// import BookAdmin from "../components/BookAdmin";
import { useSnackbar } from "notistack";
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";

type BookType = {
  _id: string;
  title: string;
  img: string;
  featured: boolean;
  likedBy?: string[];
  borrowedBy?: { user: string; name?: string; returnedBy?: string }[];
  quantity: number;
};

function BorrowedBooks() {
  const { returnBookStore } = bookStore();

  const { enqueueSnackbar } = useSnackbar();
  const tableVariants = {
    initial: {
      opacity: 0,
      scale: 0.9,
    },
    animate: (index: number) => ({
      opacity: 1,
      scale: 1,

      transition: {
        delay: index * 0.1,
        duration: 1,
      },
    }),
  };
  const { books } = bookStore();
  const [loading, setLoading] = useState(true);
  const [borrowedBook, setBorrowedBook] = useState<BookType[]>([]);

  useEffect(() => {
    setLoading(true);
    setBorrowedBook(
      books.filter((book) => book.borrowedBy?.length > 0 && book)
    );
    setLoading(false);
  }, [books]);

  const returnBook = async (bookId: string, user: string) => {
    // console.log(token);
    const token = localStorage.getItem("token");
    try {
      await returnBookStore(bookId, user, token);
      enqueueSnackbar("Book returned", {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    } catch (e) {
      console.log(e);
      enqueueSnackbar("Something went wrong", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }
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
          All Borrowed Books
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
              placeholder="Search a borrowed book..."
              className=" w-[400px]  text-slate-200 bg-slate-950 px-1 py-2 mr-2 rounded-lg focus:outline-none text-lg"
            />
            <button className=" bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg h-full">
              <SearchIcon />
            </button>
          </form>
          {/* <button className="bg-green-700 px-2 tex-md font-semibold rounded-lg hover:bg-green-800 duration-200">
            Create book
          </button> */}
        </motion.div>
      </div>

      <table className="w-full mt-8  text-sm text-left rtl:text-right text-gray-500 ">
        {" "}
        <thead className="uppercase bg-gray-900 text-yellow-500">
          <tr>
            <th scope="col" className="px-6 py-3 ">
              Book ID
            </th>
            <th scope="col" className="px-6 py-3 ">
              Book Title
            </th>
            <th scope="col" className="px-6 py-3">
              Book Cover
            </th>
            <th scope="col" className="px-6 py-3 ">
              Borrowed by
            </th>
            <th scope="col" className="px-6 py-3 ">
              Returned by
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="">
          {loading ? (
            // <td>Loading</td>
            [1, 2, 3].map((sk) => (
              <tr key={sk}>
                <td>
                  <Skeleton
                    style={{ backgroundColor: " rgba(50, 60, 50,0.4)" }}
                    // width={200}
                    variant="text"
                    animation="pulse"
                    height={35}
                  />
                </td>
                <td>
                  <Skeleton
                    style={{ backgroundColor: " rgba(50, 60, 50,0.4)" }}
                    // width={200}
                    variant="text"
                    animation="pulse"
                    height={35}
                  />
                </td>
                <td>
                  <Skeleton
                    style={{ backgroundColor: " rgba(50, 60, 50,0.4)" }}
                    // width={200}
                    variant="text"
                    animation="pulse"
                    height={35}
                  />
                </td>
                <td>
                  <Skeleton
                    style={{ backgroundColor: " rgba(50, 60, 50,0.4)" }}
                    // width={200}
                    variant="text"
                    animation="pulse"
                    height={35}
                  />
                </td>
              </tr>
            ))
          ) : borrowedBook ? (
            borrowedBook.map((book, index) =>
              // book.borrowedBy.length &&

              book.borrowedBy?.map((borrow) => (
                <motion.tr
                  key={book._id}
                  variants={tableVariants}
                  initial="initial"
                  whileInView={"animate"}
                  viewport={{
                    once: true,
                  }}
                  custom={index}
                  className="odd:bg-slate-800 odd:dark:bg-slate-900 even:bg-slate-950 even:dark:bg-gray-900  hover:bg-slate-700 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-slate-200 whitespace-nowrap dark:text-white"
                  >
                    {book._id}
                  </th>
                  <td className="px-6 py-4 text-slate-400 font-bold text-md">
                    {book.title}
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-bold text-md">
                    <img
                      src={`http://localhost:3000/uploads/${book.img}`}
                      className="w-10"
                    />
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-bold text-md">
                    {borrow.name}
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-bold text-md">
                    {borrow.returnedBy}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => returnBook(book._id, borrow.user)}
                      className="bg-blue-900 hover:bg-blue-950 duration-200 text-white px-2 py-1 rounded-md text-sm"
                    >
                      Returned
                    </button>
                  </td>
                </motion.tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-5xl py-3">
                No items
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BorrowedBooks;
