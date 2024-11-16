import axios from "axios";
import { create } from "zustand";
import bookStore from "./BookStore";

type adminLoginType = {
  username: string;
  password: string;
};

type Student = {
  _id: string;
  name: string;
  email: string;
  password: string;
};

type State = {
  admin: Omit<adminLoginType, "password">;
  students: Omit<Student, "password">[];
  loggedStudent: Omit<Student, "password"> | null;
};

type Actions = {
  setAdmin: (admin: Omit<adminLoginType, "password">) => void;
  addStudentStore: (
    studentData: Omit<Student, "_id" | "password"> | Omit<Student, "password">,
    token?: string | null
  ) => void;
  getAllStudents: (token: string | null) => void;
  deleteStudentStore: (user: string, token: string | null) => void;
  // registerStudentStore: (studentData: Omit<Student, "_id">) => void;
  loginStudent: (student: Omit<Student, "_id" | "name">) => Promise<string>;
  logoutStudent: () => void;
  setStudent: (student: Omit<Student, "password">) => void;
  getAdminDashboard: (token: string | null) => void;
};

const userStore = create<Actions & State>((set) => ({
  admin: { username: "" },
  students: [],
  loggedStudent: null,

  setStudent(student: Omit<Student, "password">) {
    set((state) => ({
      ...state,
      loggedStudent: { ...student },
    }));
  },

  setAdmin(admin) {
    console.log("Inside setAdmin store", admin);

    set((state) => ({
      ...state,
      admin: admin,
    }));
  },

  async addStudentStore(
    studentData: Omit<Student, "_id" | "password"> | Omit<Student, "password">,
    token?: string | null
  ) {
    console.log("Inside addStudentStore", studentData);

    const registerStudentCall = await axios.post(
      "http://localhost:3000/api/student/",
      studentData,
      { headers: { Authorization: token } }
    );

    console.log("RegisterCall", registerStudentCall.data);

    set((state) => ({
      ...state,
      students: [...state.students, registerStudentCall.data],
    }));
  },

  async getAllStudents(token: string | null) {
    const getAllStudentCall = await axios.get(
      "http://localhost:3000/api/student/",
      { headers: { Authorization: token } }
    );

    console.log("All Students", getAllStudentCall.data);

    set((state) => ({
      ...state,
      students: [...getAllStudentCall.data],
    }));
  },

  async getAdminDashboard(token: string | null) {
    const getAllStudentCall = await axios.get(
      "http://localhost:3000/api/student/",
      { headers: { Authorization: token } }
    );

    console.log("All Students", getAllStudentCall.data);
    const getBookCall = await axios.get("http://localhost:3000/api/book");

    // set((state) => ({
    //   ...state,
    //   books: [...getBookCall.data],
    // }));

    console.log("GetBookCall", getBookCall.data);
    // const { getAllBookStore } = bookStore.getState();
    const { setBooks } = bookStore.getState();

    setBooks(getBookCall.data);

    set((state) => ({
      ...state,
      students: [...getAllStudentCall.data],
    }));
  },

  async deleteStudentStore(user: string, token: string | null) {
    console.log("Inside deleteStudentStore", user);

    const deletedStudentCall = await axios.delete(
      `http://localhost:3000/api/student/${user}`,
      {
        headers: { Authorization: token },
      }
    );

    const { getAllBookStore } = bookStore.getState();
    getAllBookStore();

    set((state) => ({
      ...state,
      students: state.students.filter(
        (student) => student._id !== deletedStudentCall.data._id
      ),
    }));
  },

  async loginStudent(student: Omit<Student, "_id" | "name">) {
    console.log("Inside loginStudent", student);

    const loginCall = await axios.post(
      "http://localhost:3000/api/student/login",
      student
    );

    console.log("Response api", loginCall.data.token, loginCall.data._doc);

    set((state) => ({
      ...state,
      loggedStudent: { ...loginCall.data._doc },
    }));

    return loginCall.data.token;
  },

  logoutStudent() {
    set((state) => ({
      ...state,
      loggedStudent: null,
    }));
  },
}));

export default userStore;
