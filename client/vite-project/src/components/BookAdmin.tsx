/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "react-modal";
import { useSnackbar } from "notistack";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import bookStore from "../store/BookStore";
import CancelIcon from "@mui/icons-material/Cancel";

type Props = {
  book: {
    _id: string;
    title: string;
    img: string;
    featured: boolean;
    likedBy?: string[];
    borrowedBy?: { user: string; returnedBy?: string }[];
    quantity: number;
  };
};

type BookType = {
  _id: string;
  title: string;
  img: string;
  featured: boolean;
  // borrowedBy?: { by: string; returnedBy?: string }[];
  quantity: number;
};

function BookAdmin({ book }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const token = localStorage.getItem("token");

  const [updateBook, setUpdateBook] = useState<BookType>({
    _id: "",
    title: "",
    img: "",
    featured: false,
    // borrowedBy: [],
    quantity: 0,
  });
  const [path, setPath] = useState("");
  const [bookImg, setBookImg] = useState<File | undefined>();
  const { deleteBookStore, updateBookStore } = bookStore();
  // const token = localStorage.getItem("token");
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const location = useLocation();

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFileList = e.target.files as FileList;

    setBookImg(selectedFileList?.[0]);
  };

  useEffect(() => {
    setPath(location.pathname.split("/dashboard/")[1]);
  }, [location]);

  const handleDeleteBook = async (
    e: React.FormEvent<HTMLFormElement>,
    bookId: string
  ) => {
    e.stopPropagation();
    console.log("Book Id deleted is:", bookId);

    try {
      await deleteBookStore(bookId, token);

      enqueueSnackbar("Deleted successfuly", {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    } catch (e) {
      console.log(e);
      enqueueSnackbar("Deletion failed", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }
  };

  const openEditBookModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    setIsOpenEditModal(true);
    const { likedBy, borrowedBy, ...myBook } = book;
    setUpdateBook(myBook);
  };
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;

    setUpdateBook((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updateBook.quantity > 0) {
      console.log("Update input is:", updateBook);
      try {
        await updateBookStore(updateBook, bookImg, token);
        enqueueSnackbar("Book updated successfuly", {
          variant: "success",
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
        });
      } catch (e) {
        console.log(e);
        enqueueSnackbar("Error input or network issue", {
          variant: "error",
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
        });
      } finally {
        closeModal();
      }
    } else {
      console.log("Update input quantity cant be 0");
      enqueueSnackbar("Update input quantity cant be 0", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }
  };

  const closeModal = () => {
    setIsOpenEditModal(false);
    setUpdateBook({
      _id: "",
      title: "",
      img: "",
      featured: false,
      quantity: 0,
    });
  };

  return (
    <>
      <div className="flex  hover:border-[1px] hover:border-black transition-all duration-200 cursor-pointer  relative group flex-col min-h-[20rem] max-h-[25rem] mb-3 border-[1px] border-slate-600 rounded-t-xl bg-slate-900  ">
        {/**IMAGE CONTAINER */}
        {book.featured && (
          <p className="absolute top-1 z-[1] right-1 bg-yellow-600 rounded-lg px-2  py-[1px] text-[0.8rem]">
            Featured
          </p>
        )}

        <div className="h-56 rounded-t-xl  relative  py-5 flex justify-center items-center">
          <img
            src={`http://localhost:3000/uploads/${book.img}`}
            alt=""
            className="w-[60%] z-0   mx-auto group-hover:scale-110 duration-500 transition-all h-[90%]  object-center"
          />
        </div>

        {/**BOOK DESC */}
        <div className="mt-5 py-2 px-5">
          {/* <p className="text-slate-500">Design Low Book</p> */}
          <p className="font-bold text-xl group-hover:t0000000000ext-yellow-500 transition-all duration-200 text-blue-600 mb-2">
            {book.title}
          </p>

          <p className="text-xs mb-1 text-slate-400">
            Total: <b>{book.quantity}</b> | Borrowed:{" "}
            <b>{book.borrowedBy?.length}</b>
          </p>

          {path === "books" && (
            <div className="flex gap-2">
              <EditIcon
                className="text-green-500 rounded-lg hover:border-green-500 p-1 hover:border"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={(e: any) => openEditBookModal(e)}
                style={{ fontSize: "1.5rem" }}
              />

              <DeleteIcon
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={(e: any) => handleDeleteBook(e, book._id)}
                className="text-red-500 p-1 hover:border-red-500 rounded-lg hover:border"
                style={{ fontSize: "1.5rem" }}
              />
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isOpenEditModal}
        onRequestClose={closeModal}
        overlayClassName="Overlay"
        className="top-[50%] fixed z-[2]  left-[50%] bg-white right-auto w-1/3 overflow-y-auto  border-[1px] p-4 rounded-lg shadow-lg bottom-auto m-r-[-50%] translate-x-[-50%] translate-y-[-50%] h-[70%]"
      >
        <h1 className="text-blue-700 text-3xl mb-2 font-bold">Update Book</h1>
        <hr className="mb-5" />
        <form onSubmit={handleSubmitUpdate}>
          <label className="text-lg" htmlFor="title">
            Book title:
          </label>
          <br />
          <input
            type="title"
            className="my-2 border-[1px] border-slate-400 w-1/2 px-1 py-2 focus:outline-blue-600 rounded-lg text-md"
            required
            name="title"
            placeholder="Input book title..."
            value={updateBook.title}
            onChange={handleChangeInput}
            minLength={3}
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
            value={updateBook.quantity}
            id="quantity"
          />
          <br />
          <span className="text-lg">Book Image:</span>
          <br />

          <label htmlFor="bookImg" className=" cursor-pointer">
            <PermMediaIcon htmlColor="tomato" className="mr-2" />
            <span className="text-sm text-slate-500">jpg/jpeg/png</span>
            <input
              type="file"
              style={{ display: "none" }}
              id="bookImg"
              accept=".png,.jpeg,.jpg"
              name="bookImg"
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
            checked={updateBook.featured}
            type="checkbox"
            name="featured"
          />
          <br />
          <button className="bg-blue-600 text-white text-lg px-4 py-2 hover:bg-blue-700  w-full">
            Update
          </button>
        </form>
      </Modal>
    </>
  );
}

export default BookAdmin;
