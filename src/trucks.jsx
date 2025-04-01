import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import PercentageBar from "./percentageBar";
import "leaflet/dist/leaflet.css";
import { convertToEST, fetchWithAuth } from "./utils";
import { MapComponent } from "./map";

export function GarbageTrucks() {
  const [trucks, setTrucks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(
          `${process.env.REACT_APP_TRUCKS_ENDPOINT_GENERAL}`,
        );
        const data = await response.json();
        console.log(data);
        setTrucks(data);
      } catch (error) {
        console.error("Error fetching trucks data:", error);
      }
    };
    fetchData();
  }, []);

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
      {trucks.length > 0 ? (
        <MapComponent data={trucks} type="truck" />
      ) : (
        <p>Loading trucks...</p>
      )}
      <h2>Garbage Trucks</h2>
      <p>
        Are you a Driver? Start your route{" "}
        <a href="/truck/route/select-truck">here</a>
      </p>
    </Container>
  );
}

export function TruckDetails() {
  const { truckID } = useParams();
  const location = useLocation();
  const [fillWeightData, setTruckWeight] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const maxCapacity = queryParams.get("maxCapacity");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(
          `${process.env.REACT_APP_FILL_WEIGHT_TRUCK}/${truckID}`,
        );
        const data = await response.json();
        setTruckWeight(data);
      } catch (error) {
        console.error("Error fetching bin fill data:", error);
      }
    };
    if (truckID) {
      fetchData();
    }
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [truckID]);

  const isDataLoaded = fillWeightData.length > 0;

  if (!isDataLoaded) {
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
        <div
          style={{
            border: "2px solid black",
            margin: "4%",
            borderRadius: "7px",
            padding: "2%",
            paddingTop: "0%",
            backgroundColor: "#f9f9f9",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <p>Loading...</p>
        </div>
        <div
          style={{
            border: "2px solid black",
            margin: "4%",
            borderRadius: "7px",
            padding: "2%",
            paddingTop: "0%",
            backgroundColor: "#f9f9f9",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <p>Loading...</p>
        </div>
      </Container>
    );
  }

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
      <div
        style={{
          border: "2px solid black",
          margin: "4%",
          borderRadius: "7px",
          padding: "2%",
          paddingTop: "0%",
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3 style={{ color: "#2c3e50" }}>Weight Reading Latest:</h3>
        <div
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            color: "#34495e",
          }}
        >
          {fillWeightData[0]?.timestamp && (
            <div style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#1abc9c" }}>Timestamp: </strong>
              <span style={{ color: "#7f8c8d" }}>
                {convertToEST(fillWeightData[0].timestamp)}
              </span>
            </div>
          )}
          <div style={{ marginBottom: "10px" }}>
            <strong style={{ color: "#1abc9c" }}>Bin ID: </strong>
            <span style={{ color: "#7f8c8d" }}>{fillWeightData[0]?.binID}</span>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong style={{ color: "#1abc9c" }}>Weight Reading: </strong>
            <span style={{ color: "#7f8c8d" }}>
              {Number(fillWeightData[0]?.load)} kg
            </span>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong style={{ color: "#1abc9c" }}>Max-weight: </strong>
            <span style={{ color: "#7f8c8d" }}>
              {Math.max(
                0,
                (Number(fillWeightData[0]?.load) / maxCapacity) * 100,
              ).toFixed(2)}
              %
            </span>
          </div>
          <PercentageBar
            percentage={Math.max(
              0,
              ((Number(fillWeightData[0]?.load) / maxCapacity) * 100).toFixed(
                2,
              ),
            )}
          />
        </div>
      </div>
    </Container>
  );
}

export function SelectTruck() {
  const [trucks, setTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [routeStarted, setRouteStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(
          process.env.REACT_APP_TRUCKS_ENDPOINT_GENERAL,
        );
        const data = await response.json();
        setTrucks(data);
      } catch (error) {
        console.error("Error fetching trucks data:", error);
      }
    };
    fetchData();
  }, []);

  const handleStartRoute = () => {
    setRouteStarted(true);
    navigate(`/route/${selectedTruck}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "20px",
      }}
    >
      {!routeStarted ? (
        <>
          {trucks.length > 0 ? (
            trucks
              .filter((truck) => truck.active)
              .map((truck) => (
                <TruckCard
                  key={truck.id}
                  truck={truck}
                  selected={selectedTruck === truck.id}
                  setSelected={setSelectedTruck}
                />
              ))
          ) : (
            <p>Loading trucks...</p>
          )}

          {selectedTruck && (
            <button
              onClick={handleStartRoute}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Begin Route
            </button>
          )}
        </>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
}

export const TruckCard = ({ truck, selected, setSelected }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        padding: "20px",
        margin: "10px",
        maxWidth: "350px",
        backgroundColor: "#f9f9f9",
        transition: "transform 0.2s",
        cursor: "pointer",
        display: "flex",
        gap: "50px",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onClick={() => setSelected(truck.id)}
    >
      {selected && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "18px",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          ✓
        </div>
      )}
      <div>
        <h3 style={{ color: "#2c3e50", marginBottom: "10px" }}>{truck.id}</h3>
        <p>
          <strong>Capacity:</strong> {truck.maxCapacity} kg
        </p>
        <p>
          <strong>Status:</strong> {truck.active ? "Active" : "Inactive"}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", width: "50%" }}>
        <img src="/garbage-truck-clipartl.png" style={{ width: "70%" }} />
      </div>
    </div>
  );
};

export const RoutePage = () => {
  const { truckID } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const sendLocationToServer = async (lat, lon) => {
    try {
      const response = await fetchWithAuth(
        process.env.REACT_APP_TRUCK_LOCATION,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lat: lat, lng: lon, truckID }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Location sent successfully:", data);
      } else {
        console.error("Error sending location:", data);
      }
    } catch (error) {
      console.error("Error sending location to server:", error);
    }
  };

  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            setLoading(false);
            await sendLocationToServer(
              position.coords.latitude,
              position.coords.longitude,
            );
          },
          (error) => {
            console.error("Error getting location:", error);
            setLoading(false);
          },
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };

    const interval = setInterval(() => {
      updateLocation();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          border: "8px solid #f3f3f3",
          borderTop: "8px solid green",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      <h1 style={{ marginTop: "20px", color: "#2c3e50" }}>
        Route in Progress...
      </h1>
      <p style={{ color: "#7f8c8d" }}>Truck ID: {truckID}</p>
      <button
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/truck/route/select-truck")}
      >
        End Route
      </button>

      <style>
        {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
      </style>
    </div>
  );
};
