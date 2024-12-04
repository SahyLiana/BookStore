/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Books from "../sections/Books";
import Categories from "../sections/Categories";
import Featured from "../sections/Featured";
import MyBooks from "../sections/MyBooks";
import { motion } from "framer-motion";
import BannerImg from "../assets/girlslib.jpg";
import { io } from "socket.io-client";
import { useSnackbar } from "notistack";
const socketIo = io("http://localhost:3002");

import "./home.css";
import bookStore from "../store/BookStore";
import userStore from "../store/UserStore";
import axios from "axios";

function Home() {
  const { enqueueSnackbar } = useSnackbar();
  const [activeSection, setActiveSection] = useState("Home");
  const { getAllBookStore } = bookStore();
  const [sticky, setSticky] = useState(false);
  const {
    loggedStudent,
    setLoggedStudent,
    setSocket,
    setStudent,
    onlineUsers,
    // setOnlineUsers,
    user,
    socket,
    conversation,
    setConversationStore,
    setMessageConversationStore,
  } = userStore();

  const [openChat, setOpenChat] = useState(false);

  console.log("open", openChat);

  useEffect(() => {
    const handleSticky = () => {
      if (window.scrollY > 60) {
        setSticky(true);
      } else if (window.scrollY < 50) {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleSticky);
    return () => removeEventListener("scroll", handleSticky);
  }, []);

  useEffect(() => {
    // const listenSocktMsg = async () => {
    console.log("Open effect", openChat);
    if (socket) {
      console.log("logged std home", loggedStudent);
      socket.on("connected", (id: string) => {
        console.log("socket id", id, loggedStudent?._id);
      });
      socket.on("getMessage", async (msg: any) => {
        console.log("Message from socket", msg.message, openChat);

        if (msg) {
          console.log("my conv is", conversation, openChat);
          if (openChat) {
            console.log("msg true", conversation, openChat);
            msg.message.read = true;
            setMessageConversationStore({ ...msg, read: true });
            const conversationCall = await axios.get(
              `http://localhost:3000/api/conversation/${user?._id}/${user?.name}/${user?._id}`
            );
            console.log("conversationcall", conversationCall.data);
          } else {
            enqueueSnackbar("New message", {
              variant: "success",
              anchorOrigin: { horizontal: "right", vertical: "bottom" },
            });
            console.log("msg false", msg, conversation);
            setMessageConversationStore({ ...msg, read: false });
          }
        }
      });
    }
    // Cleanup function to remove the listener when the effect is cleaned up
    return () => {
      if (socket) {
        socket.off("getMessage");
      }
    };
    // };
  }, [socket, openChat]);

  useEffect(() => {
    if (socket) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.on("users", (users: any) => {
        console.log("connected socket users", users);
      });
    }

    return () => {
      if (socket) {
        socket.off("users");
      }
    };
  }, [onlineUsers]);

  useEffect(() => {
    console.log("token", localStorage.getItem("tokenstd"));
    const getStudentFun = async () => {
      try {
        const getNextOutlet = await axios.get(
          "http://localhost:3000/api/student/dashboard",
          {
            headers: {
              Authorization: `${localStorage.getItem("tokenstd")}`,
            },
          }
        );

        console.log("getStudent", getNextOutlet.data);

        // const conversationCall = await axios.get(
        //   `http://localhost:3000/api/conversation/${getNextOutlet.data._id}/${getNextOutlet.data.name}/${getNextOutlet.data._id}`
        // );

        const conversationCall = await axios.get(
          `http://localhost:3000/api/conversation/${getNextOutlet.data._id}`
        );

        console.log("conversationCall", conversationCall.data);
        // setConversation(conversationCall.data);
        setConversationStore({
          _id: conversationCall.data._id,
          ...conversationCall.data,
          isOpen: false,
        });

        console.log("getStudent", getNextOutlet);
        if (getNextOutlet.data._id) {
          console.log("logged out socket", getNextOutlet.data);
          setLoggedStudent({
            _id: getNextOutlet.data._id,
            name: getNextOutlet.data.name,
            email: getNextOutlet.data._email,
          });
          console.log("logged out socket", loggedStudent);
          setSocket(socketIo);
          socketIo.on("connected", (id: string) => {
            console.log("My socketid is:", id);
          });
          socketIo.emit("addUsers", getNextOutlet.data._id);
        }
        // setAdmin(getNextOutlet.data);
        setStudent(getNextOutlet.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log(e);
      }
    };
    console.log("Student token", localStorage.getItem("tokenstd"));
    getStudentFun();
  }, [loggedStudent?._id]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      console.log("Sections are:", sections);

      let currentSectionsId = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;

        const sectionHeight = section.clientHeight;

        // if (section.id === "home") {
        //   window.scrollY = 0;
        // }

        if (window.scrollY >= sectionTop - sectionHeight / 2) {
          currentSectionsId = section.id;
        }
      });
      setActiveSection(currentSectionsId);
    };

    // handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getBookCall = async () => {
      try {
        await getAllBookStore();
      } catch (e) {
        console.log(e);
      }
    };
    getBookCall();
  }, []);

  // console.log("Active section is:", activeSection, sticky);
  console.log("logged out socket", loggedStudent);

  return (
    <>
      <div
        className={`w-full z-50 top-0 ${sticky ? "sticky" : ""} bg-slate-900`}
      >
        <Navbar
          setOpenChat={setOpenChat}
          openChat={openChat}
          activeSection={activeSection}
          sticky={sticky}
        />
      </div>
      <div className="">
        <section id="Home">
          <div className="w-screen px-10 mx-auto h-[calc(100vh-100px)] gap-2  flex items-center">
            {/**LEFT TEXT */}
            <div className="basis-1/2">
              <motion.h1
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                variants={{
                  hidden: { opacity: 0, x: -100 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="text-6xl text-blue-600 font-bold"
              >
                WHAT'S ALL THE{" "}
                <span className=" border-blue-700 border-b-2">LIBRARIA</span>
              </motion.h1>
              <motion.p
                initial="hidden"
                viewport={{ once: true }}
                whileInView="visible"
                transition={{ duration: 1, delay: 1 }}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-black text-2xl mt-4"
              >
                Libraria gives you access to <b>eBooks</b>, <b>Music</b>,
                <b> Science</b>, <b>IT</b> and many <b>more</b>.
              </motion.p>

              <motion.button
                initial="hidden"
                viewport={{ once: true }}
                whileInView="visible"
                transition={{ duration: 1, delay: 2 }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                className="bg-blue-600 hover:bg-opacity-0 hover:border-2 border-2 border-blue-600 hover:text-blue-600 duration-200 transition-all text-white mt-8 text-lg px-4 py-1"
              >
                SEE MORE
              </motion.button>
            </div>

            {/**RIGHT IMG */}
            <motion.img
              initial="hidden"
              viewport={{ once: true }}
              whileInView="visible"
              transition={{ duration: 1 }}
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0 },
              }}
              className="w-1/2 -z-10"
              src={BannerImg}
            />
          </div>
        </section>
        <div className="w-[80%] mx-auto py-14">
          <Categories />
          <Books />
          {loggedStudent && <MyBooks />}

          <Featured />
        </div>
        <Footer />
        {/* <Categories /> */}
      </div>
    </>
  );
}

export default Home;
