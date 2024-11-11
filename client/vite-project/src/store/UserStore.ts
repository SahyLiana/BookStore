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
};

type Actions = {
  setAdmin: (admin: Omit<adminLoginType, "password">) => void;
  addStudentStore: (
    studentData: Omit<Student, "_id" | "password">,
    token: string | null
  ) => void;
  getAllStudents: (token: string | null) => void;
  deleteStudentStore: (user: string, token: string | null) => void;
};

const userStore = create<Actions & State>((set) => ({
  admin: { username: "" },
  students: [],

  setAdmin(admin) {
    console.log("Inside setAdmin store", admin);

    set((state) => ({
      ...state,
      admin: admin,
    }));
  },

  async addStudentStore(
    studentData: Omit<Student, "_id" | "password">,
    token: string | null
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
}));

export default userStore;
