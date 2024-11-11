import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import Modal from "react-modal";
import userStore from "../store/UserStore";
import { useSnackbar } from "notistack";
import bookStore from "../store/BookStore";

type RegisterType = {
  email: string;
  name: string;
};

function Students() {
  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();

  const [isOpenCreateStudent, setIsOpenCreateStudent] = useState(false);
  const [studentData, setStudentData] = useState<RegisterType>({
    email: "",
    name: "",
  });

  const { addStudentStore, students, deleteStudentStore } = userStore();
  const { books } = bookStore();

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setStudentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const deleteStudent = async (user: string) => {
    try {
      await deleteStudentStore(user, token);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Register student:", studentData);

    try {
      await addStudentStore(studentData, token);
      enqueueSnackbar("Student registered", {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    } catch (e) {
      console.log(e);
      enqueueSnackbar("Registration failed", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }

    closeModal();
  };

  const tableVariants = {
    initial: {
      opacity: 0,
      scale: 0.9,
    },
    animate: (index: number) => ({
      opacity: 1,
      scale: 1,

      transition: {
        delay: index * 0.1,
        duration: 1,
      },
    }),
  };

  const closeModal = () => {
    setIsOpenCreateStudent(false);
    setStudentData({ email: "", name: "" });
  };

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
          All Students
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
          <form className="border-[1px] flex  border-slate-600 rounded-lg mr-2">
            <input
              type="text"
              placeholder="Search a student's name..."
              className=" w-[400px]  text-slate-200 bg-slate-950 px-1 py-2 mr-2 rounded-lg focus:outline-none text-lg"
            />
            <button className=" bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg h-full">
              <SearchIcon />
            </button>
          </form>

          <button
            onClick={() => setIsOpenCreateStudent(true)}
            className="bg-green-700 px-2 tex-md font-semibold rounded-lg hover:bg-green-800 duration-200"
          >
            Register student
          </button>
        </motion.div>
      </div>
      <table className="w-full my-8  text-sm text-left rtl:text-right text-gray-500 ">
        {" "}
        <thead className="   uppercase bg-gray-900 text-yellow-500">
          <tr>
            <th scope="col" className="px-6 py-3 text-lg">
              Student ID
            </th>
            <th scope="col" className="px-6 py-3 text-lg">
              Student Name
            </th>
            <th scope="col" className="px-6 py-3 text-lg">
              Student Email
            </th>
            <th scope="col" className="px-6 py-3 text-lg">
              Borrowed Books
            </th>
            <th scope="col" className="px-6 py-3 text-lg">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="">
          {students.map((student, index) => (
            <motion.tr
              key={student._id}
              variants={tableVariants}
              initial="initial"
              whileInView={"animate"}
              custom={index}
              viewport={{
                once: true,
              }}
              // custom={index}
              className="odd:bg-slate-800 odd:dark:bg-slate-900 even:bg-slate-950 even:dark:bg-gray-900  hover:bg-slate-700 dark:border-gray-700"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-slate-200 whitespace-nowrap dark:text-white"
              >
                {student._id}
              </th>
              <td className="px-6 py-4 text-slate-400 font-bold text-md">
                {student.name}
              </td>
              <td className="px-6 py-4 text-slate-400 font-bold text-md">
                {student.email}
              </td>
              <td className="px-6 py-4 text-slate-400 font-bold text-md">
                {
                  books.filter((book) =>
                    book.borrowedBy.find(
                      (borrow) => borrow.user === student.email
                    )
                  ).length
                }
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => deleteStudent(student.email)}
                  className="bg-red-900 hover:bg-red-950 duration-200 text-white px-2 py-1 rounded-md text-sm"
                >
                  Delete
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isOpenCreateStudent}
        onRequestClose={closeModal}
        overlayClassName="Overlay"
        className="top-[50%] fixed left-[50%] z-[100] bg-white right-auto w-1/3 overflow-y-auto  border-[1px] p-4 rounded-lg shadow-lg bottom-auto m-r-[-50%] translate-x-[-50%] translate-y-[-50%] h-[70%]"
      >
        <h1 className="text-blue-700 text-3xl mb-2 font-bold">
          Register Student
        </h1>
        <hr className="mb-5" />
        <form onSubmit={handleSubmit}>
          <label className="text-lg" htmlFor="email">
            Student email:
          </label>
          <br />
          <input
            type="email"
            onChange={handleChangeInput}
            className="my-2 border-[1px] border-slate-400 w-1/2 px-1 py-2 focus:outline-blue-600 rounded-lg text-md"
            required
            name="email"
            placeholder="Student email..."
            minLength={3}
            id="email"
          />
          <br />
          <label className="text-lg" htmlFor="name">
            Student name:
          </label>
          <br />
          <input
            type="text"
            onChange={handleChangeInput}
            className="my-2 border-[1px] border-slate-400 w-1/2 px-1 py-2 focus:outline-blue-600 rounded-lg text-md"
            required
            name="name"
            placeholder="Student name..."
            id="name"
          />
          <br />
          <button className="bg-blue-600 mt-2 text-white text-lg px-4 py-2 hover:bg-blue-700  w-full">
            Register
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Students;
