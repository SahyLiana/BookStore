/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import Wbook from "../assets/wbook.jpg";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const adminUserRef = useRef<HTMLInputElement>(null);
  const adminpwdRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleLoginFunction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(
      "The input are",
      adminUserRef.current && adminUserRef.current.value,
      adminpwdRef.current && adminpwdRef.current.value
    );

    const username = adminUserRef.current && adminUserRef.current.value;
    const password = adminpwdRef.current && adminpwdRef.current.value;

    try {
      const adminApi = await axios.post("http://localhost:3000/api/admin", {
        username,
        password,
      });

      console.log("The admin api is", adminApi.data);

      localStorage.setItem("token", `Bearer ${adminApi.data}`);
      navigate("/dashboard/home");
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-yellow-300">
      <div className="w-2/3 bg-white h-1/2 overflow-hidden flex rounded-xl items-center shadow-2xl overflow-y-auto">
        <div className="w-1/2 h-full   justify-center flex items-center ">
          <motion.img
            src={Wbook}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1 }}
            variants={{
              hidden: { opacity: 0, x: -100 },
              visible: { opacity: 1, x: 0 },
            }}
          />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1, delay: 1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          className="w-1/2 px-10 bg-slate-50"
        >
          <h1 className="text-center text-5xl text-yellow-800 font-bold">
            Admin Login
          </h1>
          <div className="w-4/5 my-2 bg-yellow-800 mx-auto h-[1px]"></div>
          <form onSubmit={handleLoginFunction}>
            <label htmlFor="username" className="text-lg font-bold ">
              Username
            </label>
            <br />
            <input
              type="text"
              required
              id="username"
              ref={adminUserRef}
              className="mb-3 mt-2 px-2 py-2 text-lg focus:shadow-md focus:outline-none border-[1px] rounded-xl w-1/2"
              placeholder="Enter your username..."
              minLength={3}
            />
            <br />
            <label htmlFor="password" className="text-lg font-bold ">
              Password
            </label>
            <br />
            <input
              type="password"
              required
              id="password"
              ref={adminpwdRef}
              className="mb-3 mt-2 px-2 py-2 text-lg focus:shadow-md focus:outline-none border-[1px] rounded-xl w-1/2"
              placeholder="Enter your password..."
              minLength={3}
            />
            <br />
            <button className="w-full bg-yellow-400 font-bold p-3 text-lg text-yellow-800 duration-200 transition-all hover:bg-yellow-500">
              Login
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
