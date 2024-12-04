/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from "react-router-dom";
import AdminNav from "../components/AdminNav";

import userStore from "../store/UserStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import OpenChat from "../components/OpenChat";
import ChatIcon from "@mui/icons-material/Chat";
import { io } from "socket.io-client";
import axios from "axios";
// const socketIo = io("http://localhost:3002");

function Dashboard() {
  const {
    admin,
    setOnlineUsers,
    socket,
    // onlineUsers,
    conversations,
    conversation,
    setMessageConversationStore,
    setConversationStore,
    setUnreadMessage,
    unreadMessage,
    setConversations,
    setSocket,
  } = userStore();

  // const { getAllBookStore } = bookStore();
  // const token = localStorage.getItem("token");

  const [openChat, setOpenChat] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // setSocket(socket);
    console.log("socket Dashboard", socket, conversation);

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
        socket.on("getMessage", async (msg: any) => {
          if (msg) {
            console.log("message socket", msg, conversation, conversations);
            if (conversation?._id === msg.conversationId) {
              console.log("msg true");
              setMessageConversationStore({ ...msg, read: true });
              const conversationCall = await axios.get(
                `http://localhost:3000/api/conversation/${msg.message.sender.senderId}/${conversation?.members[1].name}/${admin?._id}`
              );
              console.log("conversationCall socket", conversationCall);
            } else {
              console.log("msg false");
              enqueueSnackbar("New message", {
                variant: "success",
                anchorOrigin: { horizontal: "right", vertical: "bottom" },
              });
              setMessageConversationStore({ ...msg, read: false });
              setConversations(
                conversations.map((conv) =>
                  conv._id === msg.conversationId
                    ? {
                        ...conv,
                        messages: [
                          ...(conv.messages ?? []),
                          { ...msg.message },
                        ],
                      }
                    : conv
                )
              );
              setUnreadMessage(true);
            }
          }
        });
      }
    }

    return () => {
      if (socket) {
        socket.off("getMessage");
      }
    };
  }, [socket, conversations, conversation?._id]);

  useEffect(() => {
    if (!openChat) {
      console.log("null conversation", conversation);
      setConversationStore(null);
    }
  }, [openChat]);

  // useEffect(() => {
  //   console.log("all dash conv", conversations);
  //   if (
  //     conversations.some((conv) =>
  //       conv.messages?.some((msg) => msg.read === false)
  //     )
  //   ) {
  //     setUnreadMessage(true);
  //   } else {
  //     setUnreadMessage(false);
  //   }
  // }, [conversations]);

  useEffect(() => {
    async function getAllConversations() {
      const conversationsCall = await axios.get(
        "http://localhost:3000/api/conversation/"
      );
      // console.log("AllConversations", conversationsCall.data);

      setConversations(conversationsCall.data);

      if (
        conversationsCall.data.some((conv: any) =>
          conv.messages?.some((msg: any) => msg.read === false)
        )
      ) {
        setUnreadMessage(true);
      } else {
        setUnreadMessage(false);
      }
      if (socket) {
        socket.emit("allConversations", conversationsCall.data);
      }
    }

    getAllConversations();
  }, []);

  // useEffect(() => {
  //   if (socket) {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     socket.on("users", (users: any) => {
  //       console.log("connected socket users", users);
  //     });
  //   }
  // }, [onlineUsers]);

  console.log(admin);

  return (
    <div className="bg-zinc-950 flex text-slate-100 h-screen overflow-y-auto ">
      <div className=" p-2  flex items-center sticky top-0 w-[15%]  bg-black">
        <AdminNav />
      </div>
      {/* <div className="w-full"> */}
      {/* <HomeDashboard /> */}
      <div className="text-slate-100 py-14 w-full">
        <div className="flex overflow-x-hidden overflow-y-visible items-center relative px-10 py-5  border-b border-blue-400 justify-between">
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
            className={`${openChat ? "bg-red-600 hover:bg-red-700" : "bg-blue-600"}  font-bold  py-2 rounded-md hover:bg-blue-800 duration-200 text-yellow-100 transition-all px-5 relative`}
            onClick={() => setOpenChat((prev) => !prev)}
          >
            {openChat ? "Close Chat" : "Open Chat"} <ChatIcon />
            {unreadMessage && (
              <div className="absolute leading-tight py-[2px] rounded-md px-2 bg-green-500 text-white text-[0.5rem] w-[50px] line text-center top-0 right-0 translate-x-[50%] translate-y-[-50%]">
                New messages
              </div>
            )}
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
