import { Outlet } from "react-router-dom";
import AdminNav from "../components/AdminNav";

import userStore from "../store/UserStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import OpenChat from "../components/OpenChat";
import ChatIcon from "@mui/icons-material/Chat";
import { io } from "socket.io-client";
// const socketIo = io("http://localhost:3002");

function Dashboard() {
  const {
    admin,
    setOnlineUsers,
    socket,
    onlineUsers,
    setMessageConversationStore,
    setSocket,
  } = userStore();

  // const { getAllBookStore } = bookStore();
  // const token = localStorage.getItem("token");

  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    // setSocket(socket);
    console.log("socket Dashboard", socket);

    if (!socket && admin) {
      const socketIo = io("http://localhost:3002");
      console.log("socket Dashboard", socketIo);
      setSocket(socketIo);
      socketIo.on("connected", (id) => {
        console.log("My socketid is:", id);
      });
    }

    if (socket) {
      console.log("socket dashboard", socket, admin);

      // setSocket(socketIo);
      socket.on("connected", (id: string) => {
        console.log("socket id", id);
      });
      socket.emit("addUsers", admin?._id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.on("users", (users: any) => {
        console.log("connected socket users", users);
        setOnlineUsers(users);
      });
      if (admin?.username) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.on("getMessage", (msg: any) => {
          if (msg) {
            console.log("message socket", msg);
            setMessageConversationStore(msg);
          }
        });
      }
      // setSocket(socketIo);

      // if (admin?.username) {
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   socket.on("getMessage", (msg: any) => {
      //     if (msg) {
      //       console.log("message socket", msg);
      //       setMessageConversationStore(msg);
      //     }
      //   });
      // }
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.on("users", (users: any) => {
        console.log("connected socket users", users);
      });
    }
  }, [onlineUsers]);

  console.log(admin);

  return (
    <div className="bg-zinc-950 flex text-slate-100 h-screen overflow-y-auto ">
      <div className=" p-2  flex items-center sticky top-0   w-[15%]  bg-black">
        <AdminNav />
      </div>
      {/* <div className="w-full"> */}
      {/* <HomeDashboard /> */}
      <div className="text-slate-100 py-14   w-full">
        <div className="flex overflow-x-hidden items-center relative px-10  pb-10  border-b border-blue-400 justify-between">
          <motion.h1
            initial="hidden"
            viewport={{ once: true }}
            whileInView="visible"
            transition={{ duration: 1 }}
            variants={{
              hidden: { opacity: 0, x: -100 },
              visible: { opacity: 1, x: 0 },
            }}
            className="  text-slate-50 font-bold text-5xl "
          >
            Welcome {admin?.username}!
          </motion.h1>
          <motion.button
            initial="hidden"
            viewport={{ once: true }}
            whileInView="visible"
            transition={{ duration: 1 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            className={`${openChat ? "bg-red-600 hover:bg-red-700" : "bg-blue-600"}  font-bold  py-2 rounded-md hover:bg-blue-800 duration-200 text-yellow-100 transition-all px-5`}
            onClick={() => setOpenChat((prev) => !prev)}
          >
            {openChat ? "Close Chat" : "Open Chat"} <ChatIcon />
          </motion.button>

          {/* </div> */}
          {openChat && <OpenChat />}
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
