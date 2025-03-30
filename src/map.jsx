import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useState, useEffect } from "react";

export const MapComponent = ({ data, type = "bin" }) => {
  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (mapContainer._leaflet_id) return;

    const map = L.map(mapContainer).setView([43.9626, -78.8531], 13); // Set the initial view
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl:
        type === "bin"
          ? "/garbage-bin-png-3.png"
          : "/garbage-truck-clipartl.png",
      iconSize: type === "bin" ? [22, 22] : [40, 22],
      iconAnchor: [10, 10],
      popupAnchor: [0, -32],
    });

    data
      .filter((item) => item.active)
      .forEach((item) => {
        const marker = L.marker([item.lat, item.lng], {
          icon: customIcon,
        }).addTo(map);
        {
          type === "bin"
            ? marker.bindPopup(`
          <h4>${item.binType} Bin (${item.id})</h4>
          <p>Location: ${item.location}</p>
          <p>Status: ${item.active ? "Active" : "Inactive"}</p>
          <p><a href="/bin/${item.id}?binHeight=${item.height}&maxWeight=${item.maxWeight}">View Details</a></p>
        `)
            : marker.bindPopup(`
          <h4>Driver: ${item.driverName}</h4>
          <h4>Truck (${item.id})</h4>
          <p>Status: ${item.status}</p>
          <p><a href="/truck/${item.id}?maxCapacity=${item.maxCapacity}">View Details</a></p>
        `);
        }
      });

    return () => {
      map.remove();
    };
  }, [data]);

  return <div id="map" style={{ width: "100%", height: "500px" }} />;
};
