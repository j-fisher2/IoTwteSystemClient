import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Tab, Tabs } from '@mui/material';
import PercentageBar from "./percentageBar";


async function fetchFillData() {
  const response = await fetch(
    'http://localhost:3001/fill-level-data' //process.env.REACT_APP_FILL_SENSOR
  );
  console.log(response);
  const data = await response.json(); 
  console.log(data);
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
  return null;//data;
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


function Feed() {
  const [fillLevelData, setFillLevelData] = useState(null); 
  const [loadCellData, setLoadCellData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [tempAlertThreshold, setTempThreshold] = useState(30);
  const [fillLevelAlertThreshold, setFillLevelThreshold] = useState(10);
  const [loadCellAlertThreshold,setLoadcellThreshold] = useState(100);

  const BIN_HEIGHT = 100

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const [fillData,loadData, tempData] = await Promise.all([fetchFillData(),fetchTempData() /*fetchLoadData()*/]); 
        setFillLevelData(fillData); 
        console.log(fillData);
        setLoadCellData(loadData);
        setTempData(tempData);
      } catch (error) {
        console.error('Error fetching data:', error); 
      }
    }, 4000); 

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
                <span style={{ color: '#7f8c8d' }}>{convertToEST(fillLevelData.feeds[0].created_at)}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#1abc9c' }}>ID: </strong> 
                <span style={{ color: '#7f8c8d' }}>{fillLevelData.feeds[0].entry_id}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#1abc9c' }}>Temperature: </strong> 
                <span style={{ color: '#7f8c8d' }}>{fillLevelData.feeds[0].field1}&#176;C</span>
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

function Alerts() {
  return (
    <Container>
      <h2>Alerts Tab</h2>
      <p>System Alerts</p>
    </Container>
  );
}

function App() {
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

        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
