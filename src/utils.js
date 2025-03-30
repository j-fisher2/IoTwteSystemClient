import { jwtDecode } from "jwt-decode";

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const decoded = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000);
  if (decoded.exp < currentTime) {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  }

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });
  console.log(response);
  return response;
};

export const convertToEST = (timestamp) => {
  const date = new Date(timestamp);

  const options = {
    timeZone: "America/New_York",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export const Logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
