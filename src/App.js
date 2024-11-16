import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Tab, Tabs } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PercentageBar from "./percentageBar";


async function fetchFillData() {
  const response = await fetch(
    process.env.REACT_APP_FILL_SENSOR
  );
  const data = await response.json(); 
  return data;
}

async function fetchLoadData() {
  const response = await fetch(
    process.env.REACT_APP_LOAD_CELL_SENSOR
  );
  const data = await response.json(); 
  return data;
}

async function fetchTempData() {
  const response = await fetch(
    process.env.REACT_APP_TEMPERATURE_SENSOR
  );
  const data = await response.json(); 
  return data;
}

const convertToEST = (timestamp) => {
  const date = new Date(timestamp);
  
  // Convert the date to Eastern Time (EST/EDT)
  const options = {
    timeZone: 'America/New_York', 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, 
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};


function Feed({alerts,setAlerts}) {
  const [fillLevelData, setFillLevelData] = useState(null); 
  const [loadCellData, setLoadCellData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [tempAlertThreshold, setTempThreshold] = useState(20);
  const [fillLevelAlertThreshold, setFillLevelThreshold] = useState(90);
  const [loadCellAlertThreshold,setLoadcellThreshold] = useState(100);
  const BIN_HEIGHT = 50

  const addAlert = (newAlert) => {
    setAlerts((prevAlerts) => {
      const exists = prevAlerts.some(alert => alert.id === newAlert.id);
      if (!exists) {
        toast.info(`New Alert: ${newAlert.message}`, {
          position: "top-right",
          autoClose: 5000, 
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
          pauseOnHover: true,
        });
      }
      return exists ? prevAlerts : [...prevAlerts, newAlert];
    });
  };

  const acknowledgeAlert = (id) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const [fillData,tempData, loadData] = await Promise.all([fetchFillData(),fetchTempData() /*fetchLoadData()*/]); 
        setFillLevelData(fillData); 
        console.log(fillData);
        setLoadCellData(loadData);
        setTempData(tempData);
        console.log(tempData);

        const percent =  (1 - (Number(fillData[0].distance) / BIN_HEIGHT))*100;
        console.log(percent)
        const temperature = tempData[0].temperature;
        const fillDataTimestamp = convertToEST(fillData[0].timestamp);
        const tempTimestamp = convertToEST(tempData[0].timestamp)

        if (percent >= fillLevelAlertThreshold) {
          addAlert({
            id: `bin-${fillData[0].binID}-fill-${fillDataTimestamp}`,
            message: `Bin ${fillData[0].binID} filled to ${percent}% - ${fillDataTimestamp}`,
            timestamp: convertToEST(fillData[0].timestamp),
            acknowledged: false,
          });
        }
        if (tempData[0].temperature >= tempAlertThreshold) {
          addAlert({
            id: `temp-${tempData[0].TempSensorID}-${tempTimestamp}`,
            message: `Temperature Sensor ${tempData[0].TempSensorID} reading ${tempData[0].temperature}% - ${tempTimestamp}`,
            timestamp: new Date(),
            acknowledged: false,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error); 
      }
    }, 2000); 

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); 

  return (
    <Container style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '20px',
    }}>
      <h2>Feeds</h2>
      <br />
      
      {/* Fill Level Data */}
      {fillLevelData ? (
        <div style={{
          border: '2px solid black',
          margin: '4%',
          borderRadius: '7px',
          padding: '2%',
          paddingTop: '0%',
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#f9f9f9',
        }}>
          <h3 style={{ color: '#2c3e50' }}>Fill Level Latest:</h3>
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#34495e' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#1abc9c' }}>Timestamp: </strong> 
                <span style={{ color: '#7f8c8d' }}>{convertToEST(fillLevelData[0].timestamp)}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#1abc9c' }}>Bin ID: </strong> 
                <span style={{ color: '#7f8c8d' }}>{fillLevelData[0].binID}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#1abc9c' }}>Fill: </strong> 
                <span style={{ color: '#7f8c8d' }}>{((1 - (Number(fillLevelData[0].distance) / BIN_HEIGHT)) * 100).toFixed(2)}%</span>
              </div>
              <PercentageBar percentage = {((1 - (Number(fillLevelData[0].distance) / BIN_HEIGHT)) * 100).toFixed(2)} />
          </div>
        </div>
      ) : (
        <div style={{
          border: '2px solid black',
          margin: '4%',
          borderRadius: '7px',
          padding: '2%',
          paddingTop: '0%',
          backgroundColor: '#f9f9f9',
          width: '100%',
          maxWidth: '600px',
        }}>
          <p>Loading...</p>
        </div>
      )}
  
      {/* Load Cell Data */}
      {loadCellData ? (
        <div style={{
          border: '2px solid black',
          margin: '4%',
          borderRadius: '7px',
          padding: '2%',
          paddingTop: '0%',
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#f9f9f9',
        }}>
          <h3 style={{ color: '#2c3e50' }}>Garbage Truck Load:</h3>
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#34495e' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#1abc9c' }}>Timestamp: </strong> 
                <span style={{ color: '#7f8c8d' }}>{convertToEST(fillLevelData.feeds[0].created_at)}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#1abc9c' }}>ID: </strong> 
                <span style={{ color: '#7f8c8d' }}>{fillLevelData.feeds[0].entry_id}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#1abc9c' }}>Weight: </strong> 
                <span style={{ color: '#7f8c8d' }}>{fillLevelData.feeds[0].field1} kg</span>
              </div>
          </div>
        </div>
      ) : (
        <div style={{
          border: '2px solid black',
          margin: '4%',
          borderRadius: '7px',
          padding: '2%',
          paddingTop: '0%',
          backgroundColor: '#f9f9f9',
          width: '100%',
          maxWidth: '600px',
        }}>
          <p>Loading...</p>
        </div>
      )}
  
      {tempData ? (
        <div style={{
          border: '2px solid black',
          margin: '4%',
          borderRadius: '7px',
          padding: '2%',
          paddingTop: '0%',
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#f9f9f9',
        }}>
          <h3 style={{ color: '#2c3e50' }}>Incinerator Temperature:</h3>
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#34495e' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#1abc9c' }}>Timestamp: </strong> 
                <span style={{ color: '#7f8c8d' }}>{convertToEST(tempData[0].timestamp)}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#1abc9c' }}>ID: </strong> 
                <span style={{ color: '#7f8c8d' }}>{tempData[0].TempSensorID}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#1abc9c' }}>Temperature: </strong> 
                <span style={{ color: '#7f8c8d' }}>{tempData[0].temperature}&#176;C</span>
              </div>
          </div>
        </div>
      ) : (
        <div style={{
          border: '2px solid black',
          margin: '4%',
          borderRadius: '7px',
          padding: '2%',
          paddingTop: '0%',
          backgroundColor: '#f9f9f9',
          width: '100%',
          maxWidth: '600px',
        }}>
          <p>Loading...</p>
        </div>
      )}
    </Container>
  );
}  

function Alerts({alerts}) {
  return (
    <Container>
      <h2>Alerts Tab</h2>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.message}>{alert.message}</li>
        ))}
      </ul>
    </Container>
  );
}

function App() {
  const [alerts, setAlerts] = useState([]);
  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              WTE Management
            </Typography>
            <Tabs value={0} sx={{ '& .MuiTab-root': { color: 'white' } }}>
              <Tab label="Feed" component={Link} to="/" />
              <Tab label="Alerts" component={Link} to="/alerts" />
              <Tab label="Home" component={Link} to="/" />
            </Tabs>
          </Toolbar>
        </AppBar>
        <ToastContainer 
          position="top-right" 
          autoClose={5000} 
          hideProgressBar={true} 
          closeOnClick 
          draggable 
          pauseOnHover 
        />

        <Routes>
          <Route path="/" element={<Feed alerts={alerts} setAlerts={setAlerts}/>} />
          <Route path="/alerts" element={<Alerts alerts={alerts}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
