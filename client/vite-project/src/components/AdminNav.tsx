import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Home from "@mui/icons-material/Home";
import Book from "@mui/icons-material/Book";
import OpenBook from "@mui/icons-material/AddHomeWork";
import Student from "@mui/icons-material/Person";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./adminNavShadow.css";
// import { io } from "socket.io-client";
import userStore from "../store/UserStore";

function AdminNav() {
  // const [link, setLink] = useState("home");
  const navigate = useNavigate();

  const location = useLocation();
  const { socket, setAdmin, setSocket } = userStore();

  const [currentLocation, setCurrentLocation] = useState("");

  useEffect(() => {
    console.log("The location is", location.pathname.split("/dashboard/")[1]);
    setCurrentLocation(location.pathname.split("/dashboard/")[1]);
  }, [location]);

  const handleLogOut = () => {
    console.log("Socket disconnect", socket);
    setAdmin(null);
    if (socket) {
      console.log("My socket admin disconnect is:", socket);
      socket.on("connected", (id: string) => {
        console.log("My socket logout is:", id);
      });
      socket.disconnect();
      // setSocket(socket);
    }

    localStorage.removeItem("token");
    setSocket(null);

    navigate("/login");
    // window.location.reload();
  };

  return (
    <motion.div
      initial="hidden"
      viewport={{ once: true }}
      whileInView="visible"
      transition={{ duration: 1 }}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      className="h-[70%] relative bg-slate-900 flex flex-col gap-3 my-auto border-[1px]  rounded-xl border-yellow-200 border-opacity-25 shadowNav py-5 w-[90%]  px-4 mx-auto"
    >
      <h1 className="font-semibold text-blue-800 text-3xl">LIBRARIA</h1>
      <div className="mb-5 h-[1px] bg-blue-800 w-full"></div>
      <NavLink
        // onClick={() => setLink("home")}
        style={({ isActive }) =>
          isActive
            ? {
                color: "rgb(245, 219, 6)",
                fontSize: "1.05rem",
                backgroundColor: "rgba(214, 214, 212,0.1)",
              }
            : {}
        }
        className="px-1 py-2 rounded-lg text-sm text-slate-500 font-bold hover:text-yellow-500 duration-200 transition-all"
        to="home"
      >
        {currentLocation === "home" && <Home />}
        Home
      </NavLink>
      <NavLink
        // onClick={() => setLink("books")}
        style={({ isActive }) =>
          isActive
            ? {
                color: "rgb(245, 219, 6)",
                fontSize: "1.05rem",
                backgroundColor: "rgba(214, 214, 212,0.1)",
              }
            : {}
        }
        className="px-1 py-2 rounded-lg text-sm text-slate-500 font-bold hover:text-yellow-500 duration-200 transition-all"
        to="books"
      >
        {currentLocation === "books" && <Book />}
        Books
      </NavLink>
      <NavLink
        // onClick={() => setLink("borrow")}
        style={({ isActive }) =>
          isActive
            ? {
                color: "rgb(245, 219, 6)",
                fontSize: "1.05rem",
                backgroundColor: "rgba(214, 214, 212,0.1)",
              }
            : {}
        }
        className="px-1 py-2 rounded-lg  text-sm text-slate-500 font-bold hover:text-yellow-500 duration-200 transition-all"
        to="borrowedbooks"
      >
        {currentLocation === "borrowedbooks" && <OpenBook />}
        Borrowed Books
      </NavLink>
      <NavLink
        // onClick={() => setLink("students")}
        style={({ isActive }) =>
          isActive
            ? {
                color: "rgb(245, 219, 6)",
                fontSize: "1.05rem",
                backgroundColor: "rgba(214, 214, 212,0.1)",
              }
            : {}
        }
        className="px-1 py-2  rounded-lg text-sm text-slate-500 font-bold hover:text-yellow-500 duration-200 transition-all"
        to="students"
      >
        {currentLocation === "students" && <Student />}
        Students
      </NavLink>

      <button
        onClick={handleLogOut}
        className="bg-red-600 left-[50%] translate-x-[-50%] duration-200 transition-all  hover:bg-red-700 font-bold absolute bottom-5 w-[85%] py-2 rounded-lg "
      >
        Log out
      </button>
    </motion.div>
  );
}

export default AdminNav;
