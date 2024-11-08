/* eslint-disable @typescript-eslint/no-explicit-any */
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
// import { useState } from "react";
import bookStore from "../store/BookStore";
import { useState } from "react";
import Modal from "react-modal";

type Props = {
  book: {
    _id: string;
    title: string;
    img: string;
    featured: boolean;
    likedBy?: string[];
    borrowedBy?: { by: string; returnedBy?: string }[];
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
  const { likedFunction, books, borrowBookFunction } = bookStore();
  const [singleBookModal, setSingleBookModal] = useState<BookType>({
    title: "",
    img: "",
    featured: false,
    likedBy: [],
  });
  const [isOpenSingleBookModal, setIsOpenSingleBookModal] = useState(false);

  const handleLiked = (
    bookTitle: string,
    e: React.FormEvent<HTMLFormElement>,
    userId = "myId"
  ) => {
    e.stopPropagation();
    console.log("BookTile and userId are:", bookTitle);
    likedFunction(bookTitle, userId);
  };

  const handleBorrow = (
    bookTitle: string,

    quantity: number,
    e: React.FormEvent<HTMLFormElement>,
    userId = "myId",
    borrowedBy?: { by: string; returnedBy?: string }[]
  ) => {
    e.stopPropagation();
    console.log("BorrowedByLength", borrowedBy?.length);
    if (
      borrowedBy &&
      borrowedBy.length < quantity &&
      !borrowedBy?.find((borrow) => borrow.by === "myId")
    ) {
      borrowBookFunction(bookTitle, userId);
    } else {
      console.log("You cannot borrow it anymore");
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

          {book.borrowedBy?.find((borrow) => borrow.by === "myId") && (
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

          <div className="">
            {book.borrowedBy &&
              book.borrowedBy.length < book.quantity &&
              !book.borrowedBy?.find(
                (borrow) => borrow.returnedBy === "myId"
              ) && (
                <AddCircleOutlineIcon
                  onClick={(e: any) =>
                    handleBorrow(
                      book.title,

                      book.quantity,
                      e,
                      "myId",
                      book.borrowedBy
                    )
                  }
                  className="hover:text-green-800 cursor-pointer mr-2"
                />
              )}

            <FavoriteIcon
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={(e: any) => handleLiked(book.title, e)}
              className={`hover:text-red-700 cursor-pointer  ${book.likedBy?.includes("myId") && "text-red-800"}`}
            />
            <p className="text-sm mt-1">
              {book.likedBy?.includes("myId")
                ? `You and ${book.likedBy && book.likedBy.length - 1} other people liked this book`
                : `${book.likedBy?.length} people liked this book`}
            </p>
          </div>
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

            {book.borrowedBy?.find((borrow) => borrow.by === "myId") && (
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
            {book.borrowedBy &&
              book.borrowedBy.length < book.quantity &&
              book.borrowedBy?.find((borrow) => borrow.by === "myId") && (
                <AddCircleOutlineIcon
                  onClick={(e: any) =>
                    handleBorrow(
                      book.title,

                      book.quantity,
                      e,
                      "myId",
                      book.borrowedBy
                    )
                  }
                  className="hover:text-green-800 cursor-pointer mr-2"
                />
              )}

            <FavoriteIcon
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={(e: any) => handleLiked(book.title, e)}
              className={`hover:text-red-700 cursor-pointer  ${book.likedBy?.includes("myId") && "text-red-800"}`}
            />

            <p className="text-sm mt-1">
              {book.likedBy?.includes("myId")
                ? `You and ${book.likedBy && book.likedBy.length - 1} other people liked this book`
                : `${book.likedBy?.length} people liked this book`}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Book;
