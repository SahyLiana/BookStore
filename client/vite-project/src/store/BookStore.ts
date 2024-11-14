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
  likedFunction: (
    bookId: string,
    user: string | undefined,
    token: string | null
  ) => void;
  borrowBookFunction: (
    bookTitle: string,
    user: string,
    name: string,
    token: string | null,
    returnBy?: string
  ) => void;
  createBookStore: (
    createBook: createBookType,
    bookImg: File | undefined,
    token: string
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

  likedFunction: async (bookId, user, token) => {
    console.log(user);
    await axios.patch(
      `http://localhost:3000/api/book/like/${bookId}`,
      { user: user },
      { headers: { Authorization: token } }
    );
    if (user) {
      set((state) => {
        const findBookTitle = state.books.filter((book) => book._id === bookId);

        console.log("the findBookTitle", findBookTitle);

        if (findBookTitle.length) {
          const findUserId = findBookTitle[0].likedBy?.includes(user);

          console.log("findUserId", findUserId);

          if (!findUserId) {
            return {
              ...state,
              books: state.books.map((book) =>
                book._id === bookId
                  ? { ...book, likedBy: [...(book.likedBy ?? []), user] }
                  : book
              ),
            };
          } else {
            return {
              ...state,
              books: state.books.map((book) =>
                book._id === bookId
                  ? {
                      ...book,
                      likedBy: book.likedBy?.filter((like) => like !== user),
                    }
                  : book
              ),
            };
          }
        } else {
          return { ...state };
        }
      });
    }
  },

  borrowBookFunction: async (bookId, user, name, token, returnBy) => {
    console.log("BorrowBookFunction store");
    console.log("The book borrowed is " + bookId + " by " + user);

    await axios.patch(
      `http://localhost:3000/api/book/borrow/${bookId}`,
      { user, name, returnBy },
      { headers: { Authorization: token } }
    );

    set((state) => {
      const findBookTitle = state.books.find((book) => book._id === bookId);

      console.log("Findbooktitle", findBookTitle);
      if (findBookTitle) {
        // if (findBookTitle.quantity > findBookTitle.borrowedBy.length) {
        return {
          ...state,
          books: state.books.map((book) =>
            book._id === bookId
              ? {
                  ...book,
                  borrowedBy: [
                    ...book.borrowedBy,
                    { user: user, name: name, returnedBy: returnBy },
                  ],
                }
              : book
          ),
        };
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
