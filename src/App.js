import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import { AppBar, Toolbar, Typography, Tab, Tabs } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import Login from "./login";
import { Logout } from "./utils";
import Home from "./home";
import { GarbageBins, BinDetails } from "./bins";
import { GarbageTrucks, TruckDetails, SelectTruck, RoutePage } from "./trucks";
import { Residents } from "./residents";

function App() {
  const [alerts, setAlerts] = useState([]);
  const location = useLocation();

  const isRootPath = location.pathname === "/";

  return (
    <div className="App">
      {!isRootPath && (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              WTE Management
            </Typography>
            <Tabs value={0} sx={{ "& .MuiTab-root": { color: "white" } }}>
              <Tab label="Alerts" component={Link} to="/alerts" />
              <Tab label="Home" component={Link} to="/home" />
              <Tab label="Logout" component={Link} to="/logout" />
            </Tabs>
          </Toolbar>
        </AppBar>
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        closeOnClick
        draggable
        pauseOnHover
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/garbage-bins" element={<GarbageBins />} />
        <Route path="/bin/:binID" element={<BinDetails />} />
        <Route path="/garbage-trucks" element={<GarbageTrucks />} />
        <Route path="/truck/:truckID" element={<TruckDetails />} />
        <Route path="/truck/route/select-truck" element={<SelectTruck />} />
        <Route path="/route/:truckID" element={<RoutePage />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
