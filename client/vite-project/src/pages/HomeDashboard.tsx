import React, { useEffect, useState } from "react";
import CardHome from "../components/CardHome";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import bookStore from "../store/BookStore";
import userStore from "../store/UserStore";
import Chart from "react-apexcharts";
import { useSnackbar } from "notistack";
import { Skeleton } from "@mui/material";
// import axios from "axios";
// type BookType = {
//   _id: string;
//   title: string;
//   img: string;
//   featured: boolean;
//   likedBy?: string[];
//   borrowedBy: { user: string; name?: string; returnedBy?: string }[];
//   quantity: number;
// };

function HomeDashboard() {
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { books, returnBookStore, setDateStore } = bookStore();
  const { students, getAdminDashboard } = userStore();
  const [date, setDate] = useState({ bookId: "", date: "", user: "" });
  // const [loading,setLoading]=false;
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    const getBookStudentFromStore = async () => {
      try {
        await getAdminDashboard(token);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    getBookStudentFromStore();
  }, []);

  const cards = [
    {
      title: "Students",
      total: students.length,
      // total:5
    },

    {
      title: "Books",
      total: books.reduce((accumulator, book) => {
        return accumulator + book.quantity;
      }, 0),
    },

    {
      title: "Borrowed Books",
      total: books.reduce((accumulator, book) => {
        return accumulator + book.borrowedBy.length;
      }, 0),
      // total: 2,
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

  const chartOptions = {
    labels: ["Borrowed books ", "Total books", "Remaining books "],
    legend: {
      show: true,
      labels: {
        position: "top",
        colors: "white",
        fontSize: "14px",
      },
    },
    title: {
      text: "Book charts",
      style: {
        fontSize: "20px",
        color: "whitesmoke",
        fontWeight: "lighter",
      },
    },
    options: {
      chart: {
        id: "donut-chart",
        type: "donut",
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              width: "100%",
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val}`, // Tooltip with percentage
      },
    },
    colors: ["#FFC400", "#20f32e", "#206df3"], // Pie slice colors
    dataLabels: {
      enabled: true,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (val: number, opts: any) => {
        // Return the absolute value for each slice, instead of percentage
        return opts.w.config.series[opts.seriesIndex]; // Return the actual value for the slice
      },
    },
  };

  const series = [
    books.reduce((accumulator, book) => {
      return accumulator + book.borrowedBy.length;
    }, 0),
    books.reduce((accumulator, book) => {
      return accumulator + book.quantity;
    }, 0),
    books.reduce((accumulator, book) => {
      return accumulator + book.quantity;
    }, 0) -
      books.reduce((accumulator, book) => {
        return accumulator + book.borrowedBy.length;
      }, 0),
  ];

  const submitDate = async (
    e: React.FormEvent<HTMLFormElement>,
    bookId: string,
    name: string | undefined,
    user: string,
    date: { bookId: string; date: string; user: string }
  ) => {
    e.preventDefault();

    if (name && date.date && date.bookId === bookId) {
      console.log("Set date", bookId, name, user, date);
      try {
        await setDateStore(
          bookId,
          { user, returnedBy: date.date },
          localStorage.getItem("token")
        );
        enqueueSnackbar("Set successfully", {
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
    } else {
      enqueueSnackbar("Something went wrong", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }
  };

  const returnBook = async (bookId: string, user: string) => {
    console.log(token);
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

  const BookBorrowed = books.filter(
    (book) => book.borrowedBy && book.borrowedBy.length > 0
  );

  const showBookBorrowed = [];

  for (let i = 0; i < BookBorrowed.length; i++) {
    for (let j = 0; j < BookBorrowed[i].borrowedBy.length; j++) {
      if (!BookBorrowed[i].borrowedBy[j].returnedBy?.length) {
        showBookBorrowed.push({
          ...BookBorrowed[i],
          borrowedBy: [
            {
              ...BookBorrowed[i].borrowedBy[j],
              returnedBy: BookBorrowed[i].borrowedBy[j].returnedBy,
            },
          ],
        });
      }
    }
  }

  console.log("showBookBorrowed", showBookBorrowed, BookBorrowed);

  return (
    <div className="py-12 px-8">
      <div className="flex flex-wrap w-full gap-5 justify-center mb-14">
        {cards.map((card) => (
          <CardHome key={card.title} card={card} />
        ))}

        {!loading ? (
          <div className="bg-slate-900 rounded-xl py-4  h-40">
            <Chart
              options={chartOptions}
              // label={["1212", "12124"]}

              series={series}
              type="donut"
            />
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl px-4 basis-[22%] ">
            <Skeleton
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: " rgba(215, 215, 215,0.1)",
              }}
              variant="text"
              animation="pulse"
            />
          </div>
        )}
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
        {/* {loading && ( */}
        {/* )} */}
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
          {loading
            ? // <td>Loading</td>
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
            : showBookBorrowed.map((book, index) =>
                // book.borrowedBy.length &&

                book.borrowedBy.map((borrow) => (
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
                      {borrow.name}
                    </td>
                    <td className="px-6 py-4 flex">
                      <button
                        onClick={() => returnBook(book._id, borrow.user)}
                        className="bg-blue-900 hover:bg-blue-950 duration-200 text-white px-2 py-1 rounded-md text-sm"
                      >
                        Returned
                      </button>

                      <form
                        onSubmit={(e) =>
                          submitDate(
                            e,
                            book._id,
                            borrow.name,
                            borrow.user,
                            date
                          )
                        }
                        className="mx-2"
                      >
                        <label className="text-white">Returned by:</label>
                        <input
                          type="date"
                          className="ml-2"
                          onChange={(e) =>
                            setDate((prev) => ({
                              ...prev,
                              bookId: book._id,
                              date: e.target.value,
                              user: borrow.user,
                            }))
                          }
                        />
                        {date.bookId === book._id &&
                          date.date &&
                          date.user === borrow?.user && (
                            <button className="bg-green-600 mx-2 px-2 text-sm text-white ">
                              Set
                            </button>
                          )}
                      </form>
                    </td>
                  </motion.tr>
                ))
              )}
        </tbody>
      </table>
    </div>
  );
}

export default HomeDashboard;
