import axios from "axios";
import { create } from "zustand";

type BookType = {
  _id: string;
  title: string;
  img: string;
  featured: boolean;
  likedBy?: string[];
  borrowedBy: { user: string; name?: string; returnedBy?: string }[];
  quantity: number;
};

type createBookType = {
  title: string;
  featured: boolean;
  quantity: number;
};

type State = {
  books: BookType[];
};

type Actions = {
  likedFunction: (bookTitle: string, userId: string) => void;
  borrowBookFunction: (bookTitle: string, userId: string) => void;
  createBookStore: (
    createBook: createBookType,
    bookImg: File | undefined,
    token: string | null
  ) => void;
  getAllBookStore: () => void;
  deleteBookStore: (bookId: string, token: string | null) => void;
  updateBookStore: (
    updateBookInput: Omit<BookType, "borrowedBy" | "likedBy">,
    bookImg: File | undefined,
    token: string | null
  ) => void;
  setBooks: (newBooks: BookType[]) => void;
  returnBookStore: (bookId: string, user: string, token: string | null) => void;
};

// const booksValue = [
//   {
//     title: "Antman Quanumania",
//     bookImg: "http://localhost:3000/uploads/antman.jpg",
//     featured: true,
//     likedBy: ["1id", "2id", "3id", "4id"],
//     borrowedBy: [],
//     quantity: 3,
//   },
//   {
//     title: "Avenger Infinity War",
//     bookImg: "http://localhost:3000/uploads/avenger.jpeg",
//     featured: false,
//     likedBy: ["1id", "2id", "3id"],
//     borrowedBy: [{ by: "myId", returnedBy: "2024-12-12" }],
//     quantity: 2,
//   },
//   {
//     title: "Captain America",
//     bookImg: "http://localhost:3000/uploads/captain.png",
//     featured: true,
//     likedBy: ["1id", "2id", "3id", "4id", "5id"],
//     borrowedBy: [{ by: "myId", returnedBy: "2024-11-12" }],
//     quantity: 1,
//   },
//   {
//     title: "Learn Javascript",
//     bookImg: "http://localhost:3000/uploads/js.jpg",
//     featured: false,
//     likedBy: ["1id", "2id"],
//     borrowedBy: [{ by: "1id" }, { by: "2id" }],
//     quantity: 2,
//   },
//   {
//     title: "Medecine M2",
//     bookImg: "http://localhost:3000/uploads/medicine.jpg",
//     featured: true,
//     likedBy: ["1id"],
//     borrowedBy: [],
//     quantity: 4,
//   },
//   {
//     title: "Learn MERN",
//     bookImg: "http://localhost:3000/uploads/mern.jpg",
//     featured: false,
//     likedBy: ["1id", "2id", "3id"],
//     borrowedBy: [{ by: "myId" }],
//     quantity: 2,
//   },
//   {
//     title: "Learn React like a pro",
//     bookImg: "http://localhost:3000/uploads/reactbook.jpg",
//     featured: false,
//     likedBy: ["1id", "2id", "3id"],
//     borrowedBy: [{ by: "1id" }],
//     quantity: 1,
//   },
// ];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bookStore = create<State & Actions>((set) => ({
  // books: [...booksValue],
  books: [],

  setBooks: (newBooks: BookType[]) => {
    set((state) => ({
      ...state,
      books: [...newBooks],
    }));
  },

  likedFunction: (bookTitle, userId) => {
    console.log(userId);

    set((state) => {
      const findBookTitle = state.books.filter(
        (book) => book.title === bookTitle
      );

      console.log("the findBookTitle", findBookTitle);

      if (findBookTitle.length) {
        const findUserId = findBookTitle[0].likedBy?.includes(userId);
        let likedBy: string[] = [];
        console.log("findUserId", findUserId);

        if (!findUserId) {
          if (findBookTitle[0].likedBy) {
            likedBy = [...findBookTitle[0].likedBy, userId];
          } else {
            likedBy = [userId];
          }

          console.log("Liked books", likedBy);

          console.log("Mapped new liked book:", {
            ...state,
            books: state.books.map((book) =>
              book.title === bookTitle
                ? { ...book, likedBy: [...likedBy] }
                : book
            ),
          });

          return {
            ...state,
            books: state.books.map((book) =>
              book.title === bookTitle
                ? { ...book, likedBy: [...likedBy] }
                : book
            ),
          };
        } else {
          if (findBookTitle[0].likedBy) {
            likedBy = findBookTitle[0].likedBy.filter((id) => id !== userId);
          }

          console.log("DisLiked books", likedBy);

          console.log(
            "Mapped new disliked book:",
            state.books.map((book) =>
              book.title === bookTitle
                ? { ...book, likedBy: [...likedBy] }
                : book
            )
          );
          return {
            ...state,
            books: state.books.map((book) =>
              book.title === bookTitle
                ? { ...book, likedBy: [...likedBy] }
                : book
            ),
          };
        }
      } else {
        return { ...state };
      }
    });
  },

  borrowBookFunction: (bookTitle, userEmail) => {
    console.log("BorrowBookFunction store");
    console.log("The book borrowed is " + bookTitle + " by " + userEmail);

    set((state) => {
      const findBookTitle = state.books.find(
        (book) => book.title === bookTitle
      );

      console.log("Findbooktitle", findBookTitle);
      if (findBookTitle) {
        if (findBookTitle.quantity > findBookTitle.borrowedBy.length) {
          return {
            ...state,
            books: state.books.map((book) =>
              book.title === bookTitle
                ? {
                    ...book,
                    borrowedBy: [...book.borrowedBy, { user: userEmail }],
                  }
                : book
            ),
          };
        } else {
          return { ...state };
        }
      } else {
        return { ...state };
      }
    });
  },

  createBookStore: async (
    createBook: createBookType,
    bookImg: File | undefined,
    token: string | null
  ) => {
    console.log("Inside createbookStore");
    const formData = new FormData();

    if (bookImg && createBook && token) {
      formData.append("title", createBook.title);
      formData.append("featured", String(createBook.featured));
      formData.append("bookImg", bookImg);
      formData.append("quantity", createBook.quantity.toString());

      const createdBook = await axios.post(
        "http://localhost:3000/api/book",
        formData,
        { headers: { Authorization: token } }
      );

      console.log("The created Book is", createdBook);

      set((state) => ({
        ...state,
        books: [
          ...state.books,
          {
            ...createdBook.data,
            img: `${createdBook.data.img}`,
          },
        ],
      }));
    }
  },

  getAllBookStore: async () => {
    const getBookCall = await axios.get("http://localhost:3000/api/book");

    set((state) => ({
      ...state,
      books: [...getBookCall.data],
    }));
  },

  deleteBookStore: async (bookId: string, token: string | null) => {
    await axios.delete(`http://localhost:3000/api/book/${bookId}`, {
      headers: { Authorization: token },
    });

    set((state) => ({
      ...state,
      books: state.books.filter((book) => book._id !== bookId),
    }));
  },

  updateBookStore: async (
    updateBookInput: Omit<BookType, "borrowedBy" | "likedBy">,
    bookImg: File | undefined,
    token: string | null
  ) => {
    console.log("Inside updateBookStore", updateBookInput, bookImg, token);

    const formData = new FormData();

    formData.append("title", updateBookInput.title);
    formData.append("img", updateBookInput.img);
    formData.append("featured", String(updateBookInput.featured));
    if (bookImg) formData.append("bookImg", bookImg);
    formData.append("quantity", updateBookInput.quantity.toString());
    const updateCall = await axios.patch(
      `http://localhost:3000/api/book/${updateBookInput._id}`,
      formData,
      { headers: { Authorization: token } }
    );

    console.log("update response call", updateCall.data);

    set((state) => ({
      ...state,
      books: state.books.map((book) =>
        book._id === updateBookInput._id ? { ...updateCall.data } : book
      ),
    }));
  },

  returnBookStore: async (
    bookId: string,
    user: string,
    token: string | null
  ) => {
    console.log("Inside returnBookStore", bookId, user, token);
    await axios.patch(
      `http://localhost:3000/api/book/return/${bookId}/${user}`,
      {},
      { headers: { Authorization: token } }
    );

    set((state) => ({
      ...state,
      books: state.books.map((book) =>
        book._id === bookId
          ? {
              ...book,
              borrowedBy: book.borrowedBy.filter(
                (borrow) => borrow.user !== user
              ),
            }
          : book
      ),
    }));
  },
}));

export default bookStore;
