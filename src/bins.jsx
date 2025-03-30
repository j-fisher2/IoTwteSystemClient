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
import React, { useState, useEffect } from "react";
import PercentageBar from "./percentageBar";
import { convertToEST, fetchWithAuth } from "./utils";
import { MapComponent } from "./map";

export function GarbageBins() {
  const [bins, setBins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(
          process.env.REACT_APP_BINS_ENDPOINT_GENERAL,
        );
        const data = await response.json();
        console.log(data);
        setBins(data);
      } catch (error) {
        console.error("Error fetching bins data:", error);
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
      {bins.length > 0 ? <MapComponent data={bins} /> : <p>Loading bins...</p>}
      <h2>Garbage Bins</h2>
    </Container>
  );
}

export function BinDetails() {
  const { binID } = useParams();
  const location = useLocation();
  const [fillLevelData, setBinFill] = useState([]);
  const [fillWeightData, setBinWeight] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const height = queryParams.get("binHeight");
  const maxWeight = queryParams.get("maxWeight");

  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      try {
        const fillResponse = await fetchWithAuth(
          `${process.env.REACT_APP_FILL_LEVEL_BIN}/${binID}`,
        );
        const data = await fillResponse.json();
        setBinFill(data);

        const weightResponse = await fetchWithAuth(
          `${process.env.REACT_APP_WEIGHT_READING_BIN}/${binID}`,
        );
        const weightData = await weightResponse.json();
        setBinWeight(weightData);
      } catch (error) {
        console.error("Error fetching bin fill data:", error);
      }
    };
    if (binID) {
      fetchData();
    }
    intervalId = setInterval(() => {
      fetchData();
    }, 5000);
  }, [binID]);

  const isDataLoaded = fillLevelData.length > 0 && fillWeightData.length > 0;

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
        <h3 style={{ color: "#2c3e50" }}>Fill Level Latest:</h3>
        <div
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            color: "#34495e",
          }}
        >
          {fillLevelData[0]?.timestamp && (
            <div style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#1abc9c" }}>Timestamp: </strong>
              <span style={{ color: "#7f8c8d" }}>
                {convertToEST(fillLevelData[0].timestamp)}
              </span>
            </div>
          )}
          <div style={{ marginBottom: "10px" }}>
            <strong style={{ color: "#1abc9c" }}>Bin ID: </strong>
            <span style={{ color: "#7f8c8d" }}>{fillLevelData[0]?.binID}</span>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong style={{ color: "#1abc9c" }}>Fill: </strong>
            <span style={{ color: "#7f8c8d" }}>
              {Math.max(
                0,
                (
                  (1 - Number(fillLevelData[0].distance) / height) *
                  100
                ).toFixed(2),
              )}
              %
            </span>
          </div>
          <PercentageBar
            percentage={Math.max(
              0,
              ((1 - Number(fillLevelData[0].distance) / height) * 100).toFixed(
                2,
              ),
            )}
          />
        </div>
      </div>
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
              {Number(fillWeightData[0]?.load)}
            </span>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong style={{ color: "#1abc9c" }}>Max-weight: </strong>
            <span style={{ color: "#7f8c8d" }}>
              {Math.max(
                0,
                (Number(fillWeightData[0]?.load) / maxWeight) * 100,
              ).toFixed(2)}
              %
            </span>
          </div>
          <PercentageBar
            percentage={Math.max(
              0,
              ((Number(fillWeightData[0]?.load) / maxWeight) * 100).toFixed(2),
            )}
          />
        </div>
      </div>
    </Container>
  );
}
