// import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'; import PersonIcon from '@mui/icons-material/Person';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Auth from "./auth/Auth";
// import HomeDashboard from "./components/HomeDashboard";
import Books from "./pages/Books";
import Students from "./pages/Students";
import BorrowedBooks from "./pages/BorrowedBooks";
import HomeDashboard from "./pages/HomeDashboard";

function App() {
  const myRouter = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<Home />} path="/" />
        <Route element={<Login />} path="/login" />

        <Route element={<Auth />}>
          <Route element={<Dashboard />} path="/dashboard">
            <Route element={<HomeDashboard />} index path="home" />
            <Route element={<Books />} path="books" />
            <Route element={<Students />} path="students" />
            <Route element={<BorrowedBooks />} path="borrowedbooks" />
          </Route>
        </Route>
      </>
    )
  );

  return (
    <div>
      {/* <h1 className="">Hello world</h1> */}
      <RouterProvider router={myRouter} />
    </div>
  );
}

export default App;
