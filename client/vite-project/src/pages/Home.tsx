import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Books from "../sections/Books";
import Categories from "../sections/Categories";
import Featured from "../sections/Featured";
import MyBooks from "../sections/MyBooks";
import { motion } from "framer-motion";

import "./home.css";

function Home() {
  const [activeSection, setActiveSection] = useState("Home");

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

  console.log("Active section is:", activeSection);

  return (
    <div className="overflow-x-hidden">
      <Navbar activeSection={activeSection} />
      <section
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
