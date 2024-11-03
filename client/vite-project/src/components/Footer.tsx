import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

function Footer() {
  return (
    <footer>
      <div className="flex justify-between  bg-black text-slate-300 mt-32 ">
        <div className=" w-[80%] flex justify-between mx-auto py-10">
          <div className="flex gap-3 ">
            <LibraryBooksIcon
              style={{ fontSize: "4rem" }}
              className="text-blue-700"
            />
            <p className="text-[2.2rem] font-bold">LIBRARIA</p>
          </div>

          <div className="">
            <h1 className="text-3xl mb-10">Explore</h1>
            <ul className="flex flex-col gap-3">
              <li>About us</li>
              <li>Sitemap </li>
              <li>Bookmarsk</li>
              <li>Sign in /Join</li>
            </ul>
          </div>

          <div className="">
            <h1 className="text-3xl mb-10">Customer Service</h1>
            <ul className="flex flex-col gap-3">
              <li>Help Center</li>
              <li>Returns</li>
              <li>Product Recalls</li>
              <li>Accessibility</li>
              <li>Contact Us</li>
              <li>Store Pickup</li>
            </ul>
          </div>

          <div className="">
            <h1 className="text-3xl mb-10">Policy</h1>
            <ul className="flex flex-col gap-3">
              <li>Return Policy</li>
              <li>Terms of Use</li>
              <li>Security</li>
              <li>Privacy</li>
            </ul>
          </div>

          <div className="">
            <h1 className="text-3xl mb-10">Categories</h1>
            <ul className="flex flex-col gap-3">
              <li>eBooks</li>
              <li>Music</li>
              <li>Science</li>
              <li>IT</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
