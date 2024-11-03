/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import userStore from "../store/UserStore";
import { Skeleton, Box } from "@mui/material";

function Auth() {
  const getToken = localStorage.getItem("token");
  const { setAdmin } = userStore();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("The token is", getToken);
    setLoading(true);
    const getDashboard = async () => {
      try {
        const getNextOutlet = await axios.get(
          "http://localhost:3000/api/admin",
          {
            headers: { Authorization: `${getToken}` },
          }
        );

        console.log("getNextOutlet", getNextOutlet);
        setAdmin(getNextOutlet.data);
      } catch (e: any) {
        console.log(e);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, [getToken]);

  return loading ? (
    <div className="bg-black flex items-center justify-center h-screen">
      <Box
        sx={{
          position: "relative",
          width: 210,
          height: 118,
          backgroundColor: "grey.900",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
      >
        {" "}
        <Skeleton
          sx={{ bgcolor: "yellow" }}
          variant="rectangular"
          width={210}
          height={118}
        />
      </Box>
    </div>
  ) : (
    <Outlet />
  );
}

export default Auth;
