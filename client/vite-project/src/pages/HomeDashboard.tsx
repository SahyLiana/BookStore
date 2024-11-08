import { useEffect, useState } from "react";
import CardHome from "../components/CardHome";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import bookStore from "../store/BookStore";

function HomeDashboard() {
  const [loading, setLoading] = useState(true);
  const { books } = bookStore();

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  const cards = [
    {
      title: "Students",
      total: 5,
    },

    {
      title: "Books",
      total: books.reduce((accumulator, book) => {
        return accumulator + book.quantity;
      }, 0),
    },

    {
      title: "Borrowed Books",
      total: 2,
    },
    {
      title: "Remaining Books",
      total: 21,
    },
  ];

  const bookStatus = [
    {
      id: "q121324i555",
      title: "Title 1",
      borrowedBy: "John Doe",
    },
    {
      id: "rr21324i555",
      title: "Title 2",
      borrowedBy: "Jane Doe",
    },
    {
      id: "qty121324i555",
      title: "Title 3",
      borrowedBy: "Clack Doe",
    },
    {
      id: "q121324i555",
      title: "Title 4",
      borrowedBy: "Smith Doe",
    },
  ];

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

  return (
    <div className="py-12 px-8">
      <div className="flex flex-wrap w-full gap-5 justify-center mb-14">
        {cards.map((card) => (
          <CardHome key={card.title} loading={loading} card={card} />
        ))}
      </div>

      <div className="flex mb-8  justify-between w-full">
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
          Recently borrowed book
        </motion.h1>
        <motion.form
          initial="hidden"
          viewport={{ once: true }}
          whileInView="visible"
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          className="border-[1px] border-slate-600 rounded-lg mr-2"
        >
          <input
            type="text"
            placeholder="Search a borrowed book..."
            className=" w-[400px]  text-slate-200 bg-slate-950 px-1 py-2 mr-2 rounded-lg focus:outline-none text-lg"
          />
          <button className=" bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg h-full">
            <SearchIcon />
          </button>
        </motion.form>
      </div>

      <table className="w-full  text-sm text-left rtl:text-right text-gray-500 ">
        {" "}
        <thead className="   uppercase bg-gray-900 text-yellow-500">
          <tr>
            <th scope="col" className="px-6 py-3 text-lg">
              Book ID
            </th>
            <th scope="col" className="px-6 py-3 text-lg">
              Book Title
            </th>
            <th scope="col" className="px-6 py-3 text-lg">
              Borrowed by
            </th>
            <th scope="col" className="px-6 py-3 text-lg">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="">
          {bookStatus.map((book, index) => (
            <motion.tr
              key={book.id}
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
                {book.id}
              </th>
              <td className="px-6 py-4 text-slate-400 font-bold text-md">
                {book.title}
              </td>
              <td className="px-6 py-4 text-slate-400 font-bold text-md">
                {book.borrowedBy}
              </td>
              <td className="px-6 py-4">
                <button className="bg-blue-900 hover:bg-blue-950 duration-200 text-white px-2 py-1 rounded-md text-sm">
                  Returned
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HomeDashboard;
