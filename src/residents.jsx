import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "./utils";

export const Residents = () => {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await fetchWithAuth(
          process.env.REACT_APP_RESIDENTS_GENERAL,
        );
        const data = await response.json();
        console.log(data);
        setResidents(data);
      } catch (error) {
        console.error("Error fetching residents:", error);
      }
    };

    fetchResidents();
  }, []);

  if (residents.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContents: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContents: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {residents.map((resident) => (
        <ResidentCard resident={resident} />
      ))}
    </div>
  );
};

export const ResidentCard = ({ resident }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        padding: "20px",
        margin: "10px",
        maxWidth: "500px",
        backgroundColor: "#f9f9f9",
        transition: "transform 0.2s",
        display: "flex",
        gap: "50px",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div>
        <h3 style={{ color: "#2c3e50", marginBottom: "10px" }}>
          {resident.id}
        </h3>
        <p>
          <strong>Name:</strong> {resident.firstName} {resident.lastName}
        </p>
        <p>
          <strong>Email:</strong> {resident.email}{" "}
        </p>
        <p>
          <strong>Address:</strong> {resident.address}{" "}
        </p>
        <p>
          <strong>Phone:</strong> {resident.phone}{" "}
        </p>
        <p>
          <strong>Registered Bins:</strong>{" "}
          {resident.registered_bins.join(", ")}{" "}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", width: "50%" }}>
        <img src="/resident1.png" style={{ width: "100%" }} />
      </div>
    </div>
  );
};
