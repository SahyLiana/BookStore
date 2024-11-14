/* eslint-disable @typescript-eslint/no-explicit-any */
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
// import { useState } from "react";
import bookStore from "../store/BookStore";
import { useState } from "react";
import Modal from "react-modal";
import userStore from "../store/UserStore";
import { useSnackbar } from "notistack";

type Props = {
  book: {
    _id: string;
    title: string;
    img: string;
    featured: boolean;
    likedBy?: string[];
    borrowedBy?: { user: string; name?: string; returnedBy?: string }[];
    quantity: number;
  };
};

type BookType = {
  title: string;
  img: string;
  featured: boolean;
  likedBy?: string[];
};

Modal.setAppElement("#root");
function Book({ book }: Props) {
  // const [isLiked, setIsLiked] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { likedFunction, books, borrowBookFunction } = bookStore();
  const [singleBookModal, setSingleBookModal] = useState<BookType>({
    title: "",
    img: "",
    featured: false,
    likedBy: [],
  });
  const [isOpenSingleBookModal, setIsOpenSingleBookModal] = useState(false);
  const { loggedStudent } = userStore();

  const handleLiked = async (
    bookId: string,
    e: React.FormEvent<HTMLFormElement>,
    user: string | undefined
  ) => {
    e.stopPropagation();
    const token = localStorage.getItem("tokenstd");
    console.log("BookTile and userId are:", bookId);
    try {
      await likedFunction(bookId, user, token);
    } catch (e) {
      console.log(e);
      enqueueSnackbar("Unauthorized", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }
  };

  const handleBorrow = async (
    bookId: string,

    quantity: number,
    e: React.FormEvent<HTMLFormElement>,

    borrowedBy?: { name?: string; user: string; returnedBy?: string }[]
  ) => {
    e.stopPropagation();
    console.log("BorrowedByLength", borrowedBy?.length);
    if (
      borrowedBy &&
      borrowedBy.length < quantity &&
      !borrowedBy?.find((borrow) => borrow.user === loggedStudent?.email)
    ) {
      if (loggedStudent) {
        try {
          const token = localStorage.getItem("tokenstd");
          await borrowBookFunction(
            bookId,
            loggedStudent.email,
            loggedStudent?.name,
            token
          );
          enqueueSnackbar("Book borrowed", {
            variant: "success",
            anchorOrigin: { horizontal: "right", vertical: "bottom" },
          });
        } catch (e) {
          console.log(e);
          console.log("You cant borrow this anymore");
          enqueueSnackbar("Unauthorized", {
            variant: "error",
            anchorOrigin: { horizontal: "right", vertical: "bottom" },
          });
        }
      }
    } else {
      console.log("You cannot borrow it anymore");
      enqueueSnackbar("You cannot borrow it anymore", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }
  };

  function openSingleBookModal(book: BookType) {
    setSingleBookModal(book);
    setIsOpenSingleBookModal(true);
  }
  function closeModalBook() {
    // console.log("Closed");
    setIsOpenSingleBookModal(false);
    setSingleBookModal({
      title: "",
      img: "",
      featured: false,
      likedBy: [],
    });
  }

  // const handleClickSingleBooks = (book: BookType) => {
  //   setSingleBookModal(book);
  //   openSingleBookModal();
  // };

  console.log("New likes/dislikes books store are", books);
  console.log("The selected book is", singleBookModal);

  console.log(book);
  return (
    <>
      <div
        onClick={() => openSingleBookModal(book)}
        className="flex hover:border-[1px] hover:border-black transition-all duration-200 cursor-pointer relative group flex-col min-h-[22rem] mb-3 border-[1px] rounded-t-xl  basis-[23.33%]"
      >
        {/**IMAGE CONTAINER */}
        <div className="h-72 rounded-t-xl relative bg-slate-100 py-5 flex justify-center items-center">
          <img
            src={`http://localhost:3000/uploads/${book.img}`}
            alt=""
            className="w-[60%]  mx-auto group-hover:scale-110 duration-500 transition-all h-[90%]  object-center"
          />
          {book.borrowedBy?.length === book.quantity && (
            <p className="absolute p-1 text-sm top-0 rounded-tr-xl right-0 bg-red-700 text-white">
              Not available
            </p>
          )}

          {book.borrowedBy?.find(
            (borrow) => borrow.user === loggedStudent?.email
          ) && (
            <p className="absolute p-1 text-sm top-0 rounded-tl-xl left-0 bg-green-700 text-white">
              You have borrowed
            </p>
          )}
        </div>

        {/**BOOK DESC */}
        <div className="mt-5 p-5">
          <p className="text-slate-500">Design Low Book</p>
          <p className="font-bold text-xl group-hover:text-orange-600 transition-all duration-200 text-indigo-800 mb-2">
            {book.title}
          </p>

          {loggedStudent && (
            <div className="">
              {book.borrowedBy &&
                book.borrowedBy.length < book.quantity &&
                !book.borrowedBy?.find(
                  (borrow) => borrow.user === loggedStudent.email
                ) && (
                  <AddCircleOutlineIcon
                    onClick={(e: any) =>
                      handleBorrow(
                        book._id,

                        book.quantity,
                        e,
                        book.borrowedBy
                      )
                    }
                    className="hover:text-green-800 cursor-pointer mr-2"
                  />
                )}

              <FavoriteIcon
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={(e: any) =>
                  handleLiked(book._id, e, loggedStudent.email)
                }
                className={`hover:text-red-700 cursor-pointer  ${book.likedBy?.includes(loggedStudent.email) && "text-red-800"}`}
              />
              <p className="text-sm mt-1">
                {loggedStudent?.email &&
                book.likedBy?.includes(loggedStudent.email)
                  ? book.likedBy.length >= 2
                    ? `You and ${book.likedBy && book.likedBy.length - 1} other people liked this book`
                    : "You liked this book"
                  : `${book.likedBy?.length} people liked this book`}
              </p>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isOpenSingleBookModal}
        onRequestClose={closeModalBook}
        overlayClassName="Overlay"
        className="top-[50%] fixed left-[50%] z-[100] flex bg-white right-auto w-1/3 overflow-y-auto  border-[1px] p-4 rounded-lg shadow-lg bottom-auto m-r-[-50%] translate-x-[-50%] translate-y-[-50%] h-[70%]"
      >
        {/**BOOK CONTAINER */}
        <div className="w-2/3 mx-auto h-full">
          {/**IMG CONTAINER */}
          <div className=" mx-auto relative bg-slate-100 py-4 flex min-h-[43%]">
            <img
              src={`http://localhost:3000/uploads/${singleBookModal.img}`}
              className="w-1/2 mx-auto "
            />

            {book.borrowedBy?.length === book.quantity && (
              <p className="absolute p-1 text-sm top-0 rounded-tr-xl right-0 bg-red-700 text-white">
                Not available
              </p>
            )}

            {book.borrowedBy?.find((borrow) => borrow.user === "myId") && (
              <p className="absolute p-1 text-sm top-0 rounded-tl-xl left-0 bg-green-700 text-white">
                You have borrowed
              </p>
            )}
          </div>

          {/**BOOK DESCRIPTION */}
          <div className="mt-5">
            <h1 className="text-blue-800 font-bold text-2xl">{book.title}</h1>
            <p className="mb-3">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Consequatur odit eaque maiores perferendis asperiores doloremque
            </p>
            {loggedStudent && (
              <div className="">
                {book.borrowedBy &&
                  book.borrowedBy.length < book.quantity &&
                  !book.borrowedBy?.find(
                    (borrow) => borrow.user === loggedStudent.email
                  ) && (
                    <AddCircleOutlineIcon
                      onClick={(e: any) =>
                        handleBorrow(
                          book._id,

                          book.quantity,
                          e,
                          book.borrowedBy
                        )
                      }
                      className="hover:text-green-800 cursor-pointer mr-2"
                    />
                  )}

                <FavoriteIcon
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={(e: any) =>
                    handleLiked(book._id, e, loggedStudent.email)
                  }
                  className={`hover:text-red-700 cursor-pointer  ${book.likedBy?.includes(loggedStudent.email) && "text-red-800"}`}
                />
                <p className="text-sm mt-1">
                  {loggedStudent?.email &&
                  book.likedBy?.includes(loggedStudent.email)
                    ? book.likedBy.length >= 2
                      ? `You and ${book.likedBy && book.likedBy.length - 1} other people liked this book`
                      : "You liked this book"
                    : `${book.likedBy?.length} people liked this book`}
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Book;
