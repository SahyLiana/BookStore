import { Outlet } from "react-router-dom";
import AdminNav from "../components/AdminNav";
// import HomeDashboard from "../components/HomeDashboard";
import userStore from "../store/UserStore";
import { motion } from "framer-motion";
import { useEffect } from "react";
import bookStore from "../store/BookStore";

function Dashboard() {
  const { admin } = userStore();
  const { getAllBookStore } = bookStore();

  console.log(admin);

  useEffect(() => {
    const getBookFromStore = async () => {
      try {
        await getAllBookStore();
      } catch (e) {
        console.log(e);
      }
    };
    getBookFromStore();
  }, []);

  return (
    <div className="bg-zinc-950 flex text-slate-100 h-screen overflow-y-auto ">
      <div className=" p-2  flex items-center sticky top-0   w-[15%]  bg-black">
        <AdminNav />
      </div>
      {/* <div className="w-full"> */}
      {/* <HomeDashboard /> */}
      <div className="text-slate-100 py-14   w-full">
        <div className="flex overflow-x-hidden items-center px-10 shadow-sm pb-10 shadow-blue-400 justify-between">
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
            Welcome admin!
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
            className="bg-blue-600 font-bold  py-2 rounded-md hover:bg-blue-800 duration-200 text-yellow-100 transition-all px-5"
          >
            Open Chat
          </motion.button>
          {/* </div> */}
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
