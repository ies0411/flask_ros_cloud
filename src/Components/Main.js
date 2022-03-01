/* global kakao */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Link, HashRouter } from 'react-router-dom';
import Coordinate from './Coordinate';
import Map from './Map';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ChartTest from './ChartTest'


export default function Main(props){
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{marginLeft: "20px"}}>
      {/* <BrowserRouter>
        <Link to="/" style={{fontSize:"20px"}}>Map</Link><br/>
        <Link to="/coordinate" style={{fontSize:"20px"}}>좌표</Link>
        <Route path='/' exact={true} component={Map} />
        <Route path='/coordinate' component={Coordinate} />
      </BrowserRouter> */}

      <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Tello" value="1" />
            <Tab label="M300" value="2" />
            <Tab label="Streaming" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1"><Coordinate /></TabPanel>
        <TabPanel value="2"><Map /></TabPanel>
        <TabPanel value="3"><ChartTest /></TabPanel>
      </TabContext>
    </Box>
    </div>
  );
  
}