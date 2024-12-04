import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import Modal from "react-modal";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import userStore from "../store/UserStore";
import { useSnackbar } from "notistack";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ChatIcon from "@mui/icons-material/Chat";
import bookStore from "../store/BookStore";
import OpenChatStd from "./OpenChatStd";
import { io } from "socket.io-client";
import axios from "axios";

// import PersonIcon from "@mui/icons-material/Person";

type Props = {
  activeSection: string;
  setOpenChat: (prev: boolean) => void;
  openChat: boolean;
  sticky: boolean;
};

type studentType = {
  name: string;
  email: string;
  password: string;
};

Modal.setAppElement("#root");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Navbar({ activeSection, setOpenChat, openChat }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { getAllBookStore } = bookStore();
  const links = ["Home", "Categories", "Books", "My Books", "Featured"];

  const {
    addStudentStore,
    setSocket,
    loginStudent,
    loggedStudent,
    user,
    logoutStudent,
    setOnlineUsers,
    socket,
    conversation,
    setUnreadStdMsg,
    unreadStdMsg,
    setConversationStore,
  } = userStore();
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  // const [openChat, setOpenChat] = useState(false);
  // const [unread, setUnread] = useState(0);
  const [isOpenRegisterModal, setIsOpenRegisterModal] = useState(false);
  const [studentRegister, setStudentRegister] = useState<studentType>({
    name: "",
    email: "",
    password: "",
  });
  const [loginStudentData, setStudentLoginData] = useState<
    Omit<studentType, "name">
  >({ email: "", password: "" });
  const [logoutModal, setLogoutModal] = useState(false);

  // const nameRef = useRef<HTMLInputElement>(null);
  // const passRef = useRef<HTMLInputElement>(null);
  const confPassRef = useRef<HTMLInputElement>(null);
  // const emailRef = useRef<HTMLInputElement>(null);

  function openLoginModal() {
    setIsOpenLoginModal(true);
    setIsOpenRegisterModal(false);
  }

  function openRegisterModal() {
    setIsOpenRegisterModal(true);
    setIsOpenLoginModal(false);
  }

  function openChatFun() {
    if (openChat === false) {
      setOpenChat(true);
      if (conversation) {
        setConversationStore({ ...conversation, isOpen: true });
        console.log("my conv is", conversation);
      }
    } else {
      setOpenChat(false);
      if (conversation) {
        setConversationStore({ ...conversation, isOpen: false });
        console.log("my conv is", conversation);
      }
    }
  }

  function closeModal() {
    setIsOpenLoginModal(false);
    setStudentRegister({
      name: "",
      email: "",
      password: "",
    });
    setIsOpenRegisterModal(false);
    // if (conversation) setConversationStore({ ...conversation, isOpen: false });
    setStudentLoginData({ email: "", password: "" });
    setLogoutModal(false);
  }
  // ` ${sticky ? "fixed" : ""}

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (isOpenRegisterModal) {
      setStudentRegister((prev) => ({ ...prev, [name]: value }));
    } else if (isOpenLoginModal) {
      setStudentLoginData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLoging = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { tokenstd, _id, name } = await loginStudent(loginStudentData);
      enqueueSnackbar("Logged in successfuly", {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });

      console.log("My id", _id, name);

      const socketIo = io("http://localhost:3002");
      setSocket(socketIo);
      socketIo.emit("addUsers", _id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socketIo.on("users", (users: any) => {
        console.log("connected socket users", users);
        setOnlineUsers(users);
      });

      console.log("conversationCall");

      const conversationCall = await axios.get(
        `http://localhost:3000/api/conversation/${_id}`
      );

      console.log("conversationCall", conversationCall.data);
      // setConversation(conversationCall.data);
      setConversationStore({
        _id: conversationCall.data._id,
        ...conversationCall.data,
        isOpen: false,
      });

      await getAllBookStore();

      console.log("Tokenstd is", tokenstd, loggedStudent);
      localStorage.setItem("tokenstd", `Bearer ${tokenstd}`);
    } catch (e) {
      console.log(e);
      enqueueSnackbar("Invalid credentials", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    } finally {
      closeModal();
    }
  };

  // console.log("Logged student is:", loggedStudent);

  const studentLogout = async () => {
    localStorage.removeItem("tokenstd");
    logoutStudent();
    closeModal();

    setOpenChat(false);
    if (socket) {
      console.log("My std socket is:", socket);
      socket.on("connected", (id: string) => {
        console.log("My socket logout is:", id);
      });
      socket.disconnect();
    }
    try {
      await getAllBookStore();
    } catch (e) {
      console.log(e);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmPass = confPassRef.current && confPassRef.current.value;

    console.log("User registered", studentRegister);
    if (studentRegister.password !== confirmPass) {
      // console.log("Password mismatch");
      enqueueSnackbar("Password mismatch", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    } else {
      try {
        if (
          studentRegister.email &&
          studentRegister.password &&
          studentRegister.name
        ) {
          await addStudentStore(studentRegister);
          enqueueSnackbar("registered successfuly", {
            variant: "success",
            anchorOrigin: { horizontal: "right", vertical: "bottom" },
          });
        }
      } catch (e) {
        console.log(e);
        enqueueSnackbar("Error input", {
          variant: "error",
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
        });
      }
    }

    // console.log("User registered", studentRegister);
    closeModal();
  };

  useEffect(() => {
    const getUnreadMessage = () => {
      // console.log("Unread", conversation, user);
      if (conversation?.messages) {
        const a = conversation?.messages.reduce((accumulator, msg) => {
          if (!msg.read) {
            if (msg.sender.user_id !== user?._id) {
              return accumulator + 1;
            } else {
              return accumulator + 0;
            }
          } else {
            return accumulator + 0;
          }
        }, 0);
        // console.log("Unread", a);
        return a;
      } else {
        // console.log("Unread ...");
        return 0;
      }
    };
    setUnreadStdMsg(getUnreadMessage());
  }, [conversation]);

  return (
    <div
      className={`w-full top-0 bg-slate-900 flex items-center   max-h-[120px] z-50 justify-between   bg-opacity-90 text-white  border-b-[0.01rem] py-4 px-3 border-slate-400`}
    >
      {/** LOGO LEFT */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.5 }}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        className="flex items-center gap-2 basis-1/5"
      >
        <LibraryBooksIcon
          style={{ fontSize: "4rem" }}
          className="text-blue-700"
        />
        <div className="flex flex-col">
          <h1 className="text-[2.2rem] font-bold">LIBRARIA</h1>
          <p className="text-[0.55rem]">
            Celebrating words ideas and Community
          </p>
        </div>
      </motion.div>

      {/**LINKS */}
      <div className="flex justify-between  basis-2/6 ">
        {links.map((link) =>
          link === "My Books" ? (
            loggedStudent && (
              <a
                key={link}
                href={`#${link}`}
                className={`text-xl hover:text-blue-600 duration-200 transition-all ${activeSection === link ? "text-blue-700" : "text-white"}`}
              >
                {link}
              </a>
            )
          ) : (
            <a
              key={link}
              href={`#${link}`}
              className={`text-xl hover:text-blue-600 duration-200 transition-all ${activeSection === link ? "text-blue-700" : "text-white"}`}
            >
              {link}
            </a>
          )
        )}
      </div>

      {/**LOGIN REGISTER */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.5 }}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        className="flex items-center gap-2 basis-1/5 justify-end"
      >
        {!loggedStudent && (
          <>
            <button
              className=" border rounded-lg text-[0.6rem] px-2 py-1 hover:text-green-700 hover:bg-opacity-0 duration-200 transition-all border-green-700 bg-green-700"
              onClick={openLoginModal}
              // to=""
            >
              Login <LoginIcon style={{ fontSize: "1rem" }} />
            </button>
            |
            <button
              className="border rounded-lg text-[0.6rem] px-2 py-1 hover:text-blue-700 hover:bg-opacity-0 duration-200 transition-all border-blue-700 bg-blue-700"
              onClick={openRegisterModal}
              // to=""
            >
              Register <HowToRegIcon style={{ fontSize: "1rem" }} />
            </button>
          </>
        )}
        {loggedStudent && (
          <>
            <p className="text-slate-400">
              {" "}
              <PersonIcon style={{ fontSize: "1rem" }} /> {loggedStudent.name}
            </p>
            <button
              className=" border rounded-lg text-[0.6rem] px-2 py-1 hover:text-red-700 hover:bg-opacity-0 duration-200 transition-all border-red-700 bg-red-700"
              onClick={() => setLogoutModal(true)}
              // to=""
            >
              Log out <LogoutIcon style={{ fontSize: "1rem" }} />
            </button>
            <button
              className={`border relative rounded-lg text-[0.6rem] px-2 py-1 ${openChat ? "hover:text-blue-700 border-blue-700 bg-blue-700" : "hover:text-green-700 border-green-700 bg-green-700"} hover:bg-opacity-0 duration-200 transition-all `}
              onClick={() => openChatFun()}
              // to=""
            >
              {openChat ? "Close Chats" : "My Chats"}{" "}
              <ChatIcon style={{ fontSize: "1rem" }} />
              <span className="absolute top-0 right-0 bg-white rounded-full text-[0.6rem] text-green-500 py-1 px-2 font-bold translate-x-[50%] translate-y-[-50%]">
                {unreadStdMsg}
              </span>
            </button>
          </>
        )}
      </motion.div>
      {openChat && <OpenChatStd />}

      <Modal
        isOpen={logoutModal}
        onRequestClose={closeModal}
        overlayClassName="Overlay"
        className="top-[50%] fixed left-[50%] z-[100] flex items-center justify-center bg-white right-auto w-1/4 overflow-y-auto  border-[1px] p-4 rounded-lg shadow-lg bottom-auto m-r-[-50%] translate-x-[-50%] translate-y-[-50%] flex-col h-[30%]"
      >
        <h1 className="text-3xl text-red-600 mb-5 font-semibold">
          Are you sure to log out?
        </h1>
        <button
          onClick={() => studentLogout()}
          className="bg-blue-600 text-white text-lg px-4 py-2 hover:bg-blue-700  w-full"
        >
          Yes
        </button>
      </Modal>

      <Modal
        isOpen={isOpenLoginModal}
        onRequestClose={closeModal}
        overlayClassName="Overlay"
        className="top-[50%] fixed left-[50%] z-[100] bg-white right-auto w-1/3 overflow-y-auto  border-[1px] p-4 rounded-lg shadow-lg bottom-auto m-r-[-50%] translate-x-[-50%] translate-y-[-50%] h-[70%]"
      >
        <h1 className="text-blue-700 text-3xl mb-2 font-bold">Login modal</h1>
        <hr className="mb-5" />
        <form onSubmit={handleLoging}>
          <label className="text-lg" htmlFor="email">
            Your email:
          </label>
          <br />
          <input
            type="email"
            // ref={emailRef}
            className="my-2 border-[1px] border-slate-400 w-1/2 px-1 py-2 focus:outline-blue-600 rounded-lg text-md"
            required
            name="email"
            onChange={handleRegisterChange}
            placeholder="Input your email..."
            minLength={6}
            id="email"
          />
          <br />
          <label className="text-lg" htmlFor="password">
            Your password:
          </label>
          <br />
          <input
            type="password"
            // ref={passRef}
            onChange={handleRegisterChange}
            id="password"
            className="my-2 border-[1px] border-slate-400 w-1/2 px-1 py-2 focus:outline-blue-600 rounded-lg text-md"
            required
            name="password"
            placeholder="Input your password..."
            minLength={3}
          />
          <br />
          <button className="bg-blue-600 text-white text-lg px-4 py-2 hover:bg-blue-700  w-full">
            Login
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isOpenRegisterModal}
        onRequestClose={closeModal}
        overlayClassName="Overlay"
        className="top-[50%] fixed left-[50%] z-[100] bg-white right-auto w-1/3 overflow-y-auto  border-[1px] p-4 rounded-lg shadow-lg bottom-auto m-r-[-50%] translate-x-[-50%] translate-y-[-50%] h-[70%]"
      >
        <h1 className="text-blue-700 text-3xl mb-2 font-bold">
          Register modal
        </h1>
        <hr className="mb-5" />
        <form onSubmit={handleRegister}>
          <label className="text-lg" htmlFor="name">
            Your name:
          </label>
          <br />

          <input
            type="name"
            // ref={nameRef}
            onChange={handleRegisterChange}
            className="my-2 border-[1px] border-slate-400 w-1/2 px-1 py-2 focus:outline-blue-600 rounded-lg text-md"
            required
            name="name"
            placeholder="Input your name..."
            minLength={3}
            id="name"
          />
          <br />
          <label className="text-lg" htmlFor="email">
            Your email:
          </label>
          <br />

          <input
            type="email"
            // ref={emailRef}
            onChange={handleRegisterChange}
            className="my-2 border-[1px] border-slate-400 w-1/2 px-1 py-2 focus:outline-blue-600 rounded-lg text-md"
            required
            name="email"
            placeholder="Input your email..."
            minLength={6}
            id="email"
          />
          <br />
          <label className="text-lg" htmlFor="password">
            Your password:
          </label>
          <br />
          <input
            type="password"
            onChange={handleRegisterChange}
            // ref={passRef}
            id="password"
            className="my-2 border-[1px] border-slate-400 w-1/2 px-1 py-2 focus:outline-blue-600 rounded-lg text-md"
            required
            name="password"
            placeholder="Input your password..."
            minLength={3}
          />
          <br />
          <label className="text-lg" htmlFor="confirm">
            Confirm password:
          </label>
          <br />
          <input
            type="password"
            // onChange={handleRegisterChange}
            ref={confPassRef}
            id="confirm"
            className="my-2 border-[1px] border-slate-400 w-1/2 px-1 py-2 focus:outline-blue-600 rounded-lg text-md"
            required
            name="confirm"
            placeholder="Confirm your password..."
            minLength={3}
          />
          <br />
          <button className="bg-blue-600 text-white text-lg px-4 py-2 hover:bg-blue-700  w-full">
            Register
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Navbar;
