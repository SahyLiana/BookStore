import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import bookStore from "../store/BookStore";
import BookAdmin from "../components/BookAdmin";
import Modal from "react-modal";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import CancelIcon from "@mui/icons-material/Cancel";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
// import userStore from "../store/UserStore";
// import { io } from "socket.io-client";
// import axios from "axios";

type BookInputType = {
  title: string;
  featured: boolean;
  quantity: number;
};

function Books() {
  const { enqueueSnackbar } = useSnackbar();
  const { getAllBookStore } = bookStore();
  // const { socket } = userStore();
  const { books, createBookStore } = bookStore();
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    // setLoading(true);
    const getBooksCall = async () => {
      try {
        await getAllBookStore();
      } catch (e) {
        console.log(e);
      }
    };
    getBooksCall();
  }, []);

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

  const [isOpenCreateBook, setIsOpenCreateBook] = useState(false);
  const [bookImg, setBookImg] = useState<File | undefined>();
  const [bookInput, setBookInput] = useState<BookInputType>({
    title: "",
    featured: false,
    quantity: 0,
  });

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFileList = e.target.files as FileList;

    setBookImg(selectedFileList?.[0]);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;

    setBookInput((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const token = localStorage.getItem("token");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit element are:", bookInput, bookImg);

    // console.log("submit element are:", typeof formData.get("featured"));
    try {
      await createBookStore(bookInput, bookImg, token);
      enqueueSnackbar("Created successfuly", {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    } catch (e) {
      console.log(e);
      enqueueSnackbar("Input error", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    } finally {
      closeModal();
    }
    // await axios.post("http://localhost:3000/api/book");
  };

  function closeModal() {
    setIsOpenCreateBook(false);
    setBookInput({ title: "", featured: false, quantity: 0 });
    setBookImg(undefined);
  }

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
          <motion.form
            initial="hidden"
            viewport={{ once: true }}
            whileInView="visible"
            transition={{ duration: 1 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            className="border-[1px] flex  border-slate-600 rounded-lg mr-2"
          >
            <input
              type="text"
              placeholder="Search a book..."
              className=" w-[400px]  text-slate-200 bg-slate-950 px-1 py-2 mr-2 rounded-lg focus:outline-none text-lg"
            />
            <button className=" bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg h-full">
              <SearchIcon />
            </button>
          </motion.form>
          <button
            onClick={() => setIsOpenCreateBook(true)}
            className="bg-green-700 px-2 tex-md font-semibold rounded-lg hover:bg-green-800 duration-200"
          >
            Create book
          </button>
        </motion.div>

        <Modal
          isOpen={isOpenCreateBook}
          onRequestClose={closeModal}
          overlayClassName="Overlay"
          className="top-[50%] fixed left-[50%] z-40 bg-white right-auto w-1/3 overflow-y-auto  border-[1px] p-4 rounded-lg shadow-lg bottom-auto m-r-[-50%] translate-x-[-50%] translate-y-[-50%] h-[70%]"
        >
          <h1 className="text-blue-700 text-3xl mb-2 font-bold">Create book</h1>
          <hr className="mb-5" />
          <form onSubmit={handleSubmit}>
            <label className="text-lg" htmlFor="title">
              Book Title:
            </label>
            <br />
            <input
              type="text"
              onChange={handleChangeInput}
              className="my-2 border-[1px] border-slate-400 w-1/2 px-1 py-2 focus:outline-blue-600 rounded-lg text-md"
              required
              name="title"
              placeholder="Input book title..."
              minLength={3}
              value={bookInput.title}
              id="title"
            />
            <br />
            <label className="text-lg" htmlFor="quantity">
              Book quantity:
            </label>
            <br />
            <input
              type="number"
              onChange={handleChangeInput}
              className="my-2 border-[1px] border-slate-400 w-1/2 px-1 py-2 focus:outline-blue-600 rounded-lg text-md"
              required
              name="quantity"
              min={0}
              // placeholder="Input book title..."
              // minLength={3}
              value={bookInput.quantity}
              id="quantity"
            />
            <br />
            <span className="text-lg">Book Image:</span>
            <br />
            {/* <input
              onChange={handleChangeImg}
              type="file"
              id="bookImg"
              className="my-2 border-[1px] border-slate-400 w-1/2 px-1 py-2 focus:outline-blue-600 rounded-lg text-md"
              required
              name="bookImg"
            /> */}

            <label htmlFor="bookImg" className=" cursor-pointer">
              <PermMediaIcon htmlColor="tomato" className="mr-2" />
              <span className="text-sm text-slate-500">jpg/jpeg/png</span>
              <input
                type="file"
                style={{ display: "none" }}
                id="bookImg"
                accept=".png,.jpeg,.jpg"
                onChange={handleChangeImg}
              />
            </label>
            {bookImg && (
              <div className="w-20 h-28  flex flex-col min-h-20">
                {/*This URL.createObjectURL(file) will show our file before uploading it*/}
                <img
                  src={URL.createObjectURL(bookImg)}
                  className="h-[90%] w-full"
                />
                <CancelIcon
                  className="shareCancelImg"
                  onClick={() => setBookImg(undefined)}
                />
              </div>
            )}
            <br />
            <label className="mt-2 inline-block">Featured:</label>
            <input
              onChange={handleChangeInput}
              checked={bookInput.featured}
              type="checkbox"
              name="featured"
            />
            <button className="bg-blue-600 mt-2 text-white text-lg px-4 py-2 hover:bg-blue-700  w-full">
              Create
            </button>
          </form>
        </Modal>
      </div>

      {/**BOOK SECTION */}
      <div className="flex flex-wrap items-stretch gap-3 mt-10">
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
