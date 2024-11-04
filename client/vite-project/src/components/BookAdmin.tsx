import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  book: {
    title: string;
    img: string;
    featured: boolean;
    likedBy?: string[];
    borrowedBy?: { by: string; returnedBy?: string }[];
    quantity: number;
  };
};

// type BookType = {
//   title: string;
//   img: string;
//   featured: boolean;
//   likedBy?: string[];
// };

function BookAdmin({ book }: Props) {
  const [path, setPath] = useState("");

  const location = useLocation();

  useEffect(() => {
    setPath(location.pathname.split("/dashboard/")[1]);
  }, [location]);

  return (
    <>
      {" "}
      <div className="flex hover:border-[1px] hover:border-black transition-all duration-200 cursor-pointer relative group flex-col min-h-[15rem] mb-3 border-[1px] border-slate-600 rounded-t-xl bg-slate-900  ">
        {/**IMAGE CONTAINER */}
        <div className="h-72 rounded-t-xl relative  py-5 flex justify-center items-center">
          <img
            src={book.img}
            alt=""
            className="w-[60%]  mx-auto group-hover:scale-110 duration-500 transition-all h-[90%]  object-center"
          />
        </div>

        {/**BOOK DESC */}
        <div className="mt-5 p-5">
          <p className="text-slate-500">Design Low Book</p>
          <p className="font-bold text-xl group-hover:text-yellow-500 transition-all duration-200 text-blue-600 mb-2">
            {book.title}
          </p>

          {path === "borrowedbooks" && (
            <p>
              {book.borrowedBy ? book.borrowedBy.length : "0"} people borrowed
              this book
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default BookAdmin;
