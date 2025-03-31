import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Card,
  CardContent,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tab,
  Tabs,
} from "@mui/material";

export default function Home() {
  const navigate = useNavigate();
  const handleClick = (e) => {
    console.log(e.target.id);
    switch (e.target.id) {
      case "resident":
        navigate("/residents");
        break;
      case "garbage-bin":
        navigate("/garbage-bins");
        break;
      case "garbage-truck":
        navigate("/garbage-trucks");
        break;
      default:
        console.log("Unknown button");
    }
  };
  return (
    <Container
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <h2>Welcome to your Dashboard</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          id="garbage-bin"
          onClick={handleClick}
          style={{
            margin: "10px",
            cursor: "pointer",
            width: "25%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            border: "2px solid #1abc9c",
            borderRadius: "5px"
          }}
        >
          <img
            id="garbage-bin"
            src="/garbage-bin-png-3.png"
            style={{ width: "80%" }}
          />
          <h3>Bins</h3>
        </button>
        <button
          id="garbage-truck"
          onClick={handleClick}
          style={{
            margin: "10px",
            width: "25%",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            border: "2px solid #1abc9c",
            borderRadius: "5px"
          }}
        >
          <img
            id="garbage-truck"
            src="/garbage-truck-clipartl.png"
            style={{ width: "100%", marginTop: "50%" }}
          />
          <h3>Trucks</h3>
        </button>
        <button
          id="resident"
          onClick={handleClick}
          style={{
            margin: "10px",
            width: "25%",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            border: "2px solid #1abc9c",
            borderRadius: "5px"
          }}
        >
          <img id="resident" src="/resident1.png" style={{ width: "110%" }} />
          <h3>Residents</h3>
        </button>
      </div>
    </Container>
  );
}
