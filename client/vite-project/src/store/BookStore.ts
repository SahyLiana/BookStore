import { create } from "zustand";

type BookType = {
  title: string;
  img: string;
  featured: boolean;
  likedBy?: string[];
  borrowedBy: string[];
  quantity: number;
};

type State = {
  books: BookType[];
};

type Actions = {
  likedFunction: (bookTitle: string, userId: string) => void;
  borrowBookFunction: (bookTitle: string, userId: string) => void;
};

const booksValue = [
  {
    title: "Antman Quanumania",
    img: "http://localhost:3000/uploads/antman.jpg",
    featured: true,
    likedBy: ["1id", "2id", "3id", "4id"],
    borrowedBy: [],
    quantity: 3,
  },
  {
    title: "Avenger Infinity War",
    img: "http://localhost:3000/uploads/avenger.jpeg",
    featured: false,
    likedBy: ["1id", "2id", "3id"],
    borrowedBy: ["myId"],
    quantity: 2,
  },
  {
    title: "Captain America",
    img: "http://localhost:3000/uploads/captain.png",
    featured: true,
    likedBy: ["1id", "2id", "3id", "4id", "5id"],
    borrowedBy: ["myId"],
    quantity: 1,
  },
  {
    title: "Learn Javascript",
    img: "http://localhost:3000/uploads/js.jpg",
    featured: false,
    likedBy: ["1id", "2id"],
    borrowedBy: ["1id", "2id"],
    quantity: 2,
  },
  {
    title: "Medecine M2",
    img: "http://localhost:3000/uploads/medicine.jpg",
    featured: true,
    likedBy: ["1id"],
    borrowedBy: [],
    quantity: 4,
  },
  {
    title: "Learn MERN",
    img: "http://localhost:3000/uploads/mern.jpg",
    featured: false,
    likedBy: ["1id", "2id", "3id"],
    borrowedBy: ["myId"],
    quantity: 2,
  },
  {
    title: "Learn React like a pro",
    img: "http://localhost:3000/uploads/reactbook.jpg",
    featured: false,
    likedBy: ["1id", "2id", "3id"],
    borrowedBy: ["1id"],
    quantity: 1,
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bookStore = create<State & Actions>((set) => ({
  books: [...booksValue],

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

  borrowBookFunction: (bookTitle, userId) => {
    console.log("BorrowBookFunction store");
    console.log("The book borrowed is " + bookTitle + " by " + userId);

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
                ? { ...book, borrowedBy: [...book.borrowedBy, userId] }
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
}));

export default bookStore;
