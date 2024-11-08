import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Books from "../sections/Books";
import Categories from "../sections/Categories";
import Featured from "../sections/Featured";
import MyBooks from "../sections/MyBooks";
import { motion } from "framer-motion";
import BannerImg from "../assets/girlslib.jpg";

import "./home.css";
import bookStore from "../store/BookStore";

function Home() {
  const [activeSection, setActiveSection] = useState("Home");
  const { getAllBookStore } = bookStore();
  const [sticky, setSticky] = useState(false);

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
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      console.log("Sections are:", sections);

      let currentSectionsId = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;

        const sectionHeight = section.clientHeight;

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

  console.log("Active section is:", activeSection, sticky);

  return (
    <div className="">
      <div
        className={`w-full z-50 top-0 ${sticky ? "sticky" : ""} bg-slate-900`}
      >
        <Navbar activeSection={activeSection} sticky={sticky} />
      </div>

      {/* <section
        id="Home"
        className="w-screen h-[calc(100vh-50px)] background text-center flex items-center justify-center"
      >
        <div className="">
          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 2 }}
            variants={{
              hidden: { opacity: 0, x: -100 },
              visible: { opacity: 1, x: 0 },
            }}
            className="text-7xl text-blue-600 font-bold"
          >
            WHAT'S ALL THE LIBRARIA
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
            className="text-white  w-[70%] mx-auto text-3xl mt-4"
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
            className="bg-blue-600 hover:bg-opacity-0 hover:border-2 border-2 border-blue-600 hover:text-blue-600 duration-200 transition-all text-white mt-10 text-xl px-5 py-2"
          >
            SEE MORE
          </motion.button>
        </div>
      </section> */}
      <section
        id="Home"
        className="w-screen px-10 mx-auto h-[calc(100vh-100px)] gap-2  flex items-center"
      >
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
            WHAT'S ALL THE LIBRARIA
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
          className="w-1/2"
          src={BannerImg}
        />
      </section>
      <div className="w-[80%] mx-auto py-14">
        <Categories />
        <Books />
        <MyBooks />
        <Featured />
      </div>
      <Footer />
      {/* <Categories /> */}
    </div>
  );
}

export default Home;
