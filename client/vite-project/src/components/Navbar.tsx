import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
// import { Link } from "react-router-dom";
// import Modal from "react-modal";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { useState } from "react";
// import PersonIcon from "@mui/icons-material/Person";

type Props = {
  activeSection: string;
};

Modal.setAppElement("#root");
function Navbar({ activeSection }: Props) {
  const links = ["Home", "Categories", "Books", "My Books", "Featured"];

  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [isOpenRegisterModal, setIsOpenRegisterModal] = useState(false);

  function openLoginModal() {
    setIsOpenLoginModal(true);
    setIsOpenRegisterModal(false);
  }

  function openRegisterModal() {
    setIsOpenRegisterModal(true);
    setIsOpenLoginModal(false);
  }

  function closeModal() {
    setIsOpenLoginModal(false);
    setIsOpenRegisterModal(false);
  }

  return (
    <div className="flex items-center  max-h-[120px] z-50 justify-between fixed top-0 bg-black bg-opacity-90 text-white w-full border-b-[0.01rem] py-4 px-3 border-slate-400">
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
        {links.map((link) => (
          <a
            key={link}
            href={`#${link}`}
            className={`text-xl hover:text-blue-600 duration-200 transition-all ${activeSection === link ? "text-blue-700" : "text-white"}`}
          >
            {link}
          </a>
        ))}
      </div>

      {/**LOGIN REGISTER */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.5 }}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        className="flex items-center gap-2 basis-1/5 justify-end"
      >
        <button
          className=" hover:text-blue-700 duration-200 transition-all"
          onClick={openLoginModal}
          // to=""
        >
          Login
        </button>
        |
        <button
          className=" hover:text-blue-700 duration-200 transition-all"
          onClick={openRegisterModal}
          // to=""
        >
          Register
        </button>
      </motion.div>

      <Modal
        isOpen={isOpenLoginModal}
        onRequestClose={closeModal}
        overlayClassName="Overlay"
        className="top-[50%] fixed left-[50%] z-[100] bg-white right-auto w-1/3 overflow-y-auto  border-[1px] p-4 rounded-lg shadow-lg bottom-auto m-r-[-50%] translate-x-[-50%] translate-y-[-50%] h-[70%]"
      >
        <h1 className="text-blue-700 text-3xl mb-2 font-bold">Login modal</h1>
        <hr className="mb-5" />
        <form>
          <label className="text-lg" htmlFor="email">
            Your email:
          </label>
          <br />
          <input
            type="email"
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
        <form>
          <label className="text-lg" htmlFor="email">
            Your email:
          </label>
          <br />
          <input
            type="email"
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
