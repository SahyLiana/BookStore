import MenuBookIcon from "@mui/icons-material/MenuBook";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import ScienceIcon from "@mui/icons-material/Science";
import ComputerIcon from "@mui/icons-material/Computer";
import { motion } from "framer-motion";

function Categories() {
  // const categoriesVariants = {
  //   initial: {
  //     opacity: 0,
  //     scale: 0.9,
  //   },
  //   animate: (index: number) => ({
  //     opacity: 1,
  //     scale: 1,

  //     transition: {
  //       delay: index * 0.3,
  //       duration: 1,
  //     },
  //   }),
  // };
  return (
    <section id="Categories" className="mt-10 mb-32">
      <motion.h1
        initial="hidden"
        viewport={{ once: true }}
        whileInView="visible"
        transition={{ duration: 1 }}
        variants={{
          hidden: { opacity: 0, x: -100 },
          visible: { opacity: 1, x: 0 },
        }}
        className="text-5xl  mb-2"
      >
        Featured categories
      </motion.h1>
      <hr className="mb-8" />

      {/**CATEGORIES */}
      <div className="flex items-stretch gap-5  h-52 ">
        {/**CATEGORY ITEM */}
        <motion.div
          initial="hidden"
          viewport={{ once: true }}
          whileInView="visible"
          transition={{ duration: 0.1, delay: 0.1 }}
          variants={{
            hidden: { opacity: 0.2, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
          className="flex bg-purple-100 flex-col items-center  justify-center p-5 basis-1/5"
        >
          <MenuBookIcon
            style={{ fontSize: "4rem" }}
            className="text-purple-700"
          />
          <p className="text-3xl text-slate-600 font-thin">Ebooks</p>
        </motion.div>

        <motion.div
          initial="hidden"
          viewport={{ once: true }}
          whileInView="visible"
          transition={{ duration: 0.1, delay: 0.2 }}
          variants={{
            hidden: { opacity: 0.2, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
          className="flex bg-green-100 flex-col items-center  justify-center p-5 basis-1/5"
        >
          <LibraryMusicIcon
            style={{ fontSize: "3rem" }}
            className="text-green-700"
          />
          <p className="text-3xl text-slate-600 font-thin">Music</p>
        </motion.div>

        <motion.div
          initial="hidden"
          viewport={{ once: true }}
          whileInView="visible"
          transition={{ duration: 0.1, delay: 0.3 }}
          variants={{
            hidden: { opacity: 0.2, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
          className="flex bg-red-100 flex-col items-center  justify-center p-5 basis-1/5"
        >
          <ScienceIcon style={{ fontSize: "3rem" }} className="text-red-700" />
          <p className="text-3xl text-slate-600 font-thin">Science</p>
        </motion.div>

        <motion.div
          initial="hidden"
          viewport={{ once: true }}
          whileInView="visible"
          transition={{ duration: 0.1, delay: 0.5 }}
          variants={{
            hidden: { opacity: 0.2, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
          className="flex bg-teal-100 flex-col items-center  justify-center p-5 basis-1/5"
        >
          <ComputerIcon
            style={{ fontSize: "3rem" }}
            className="text-teal-700"
          />
          <p className="text-3xl text-slate-600 font-thin">IT</p>
        </motion.div>
      </div>
    </section>

    // <div className="h-40">
    //   <h1>Category</h1>
    // </div>
  );
}

export default Categories;
