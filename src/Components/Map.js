/* global kakao */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import io from 'socket.io-client'
// import 'down-arrow'
import FlightInfo from './FlightInfo';
import { take } from 'lodash';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';

let endPoint = 'http://192.168.0.18:5000';
// let socket = io.connect(`${endPoint}`);

export default function Map(props){
  const rollRef = React.useRef();
  const pitchRef = React.useRef();
  const yawRef = React.useRef();
  const [wayPoints, setWayPoints] = useState([]);
  const [altitude, setAltitude] = useState([]);
  const [messages, setMessages] = useState(["Hello and Welcome"])
  const [message, setMessage] = useState("")
  let marker;
  const [value, setValue] = React.useState('female');

  const radioChange = (event) => {
    setValue(event.target.value);
  };
  const mapStyles = {
    // overflow: "hidden",
    height: "80vh",
    width: "50vw",
    zIndex: 1,
    display:'inline-block'
  }; 

  const iconStyles = {
    width: "40px",
    zIndex: 1,
    display:'inline-block',
    cursor: 'pointer'
  }; 

  const iconStyles1 = {
    // paddingLeft: "40px",
    width: "40px",
    zIndex: 1,
    display:'inline-block',
    cursor: 'pointer'
  }; 

  const textStyles = {
    position: 'fixed',
    display:'inline-block',
    paddingLeft: "10px"
  }; 


  let path = "http://127.0.0.1:5000";

  function directionMove(direction){
    axios.get(path+'/move',
            {
                params: {
                  direction: direction
                }      
              })
          .then((response)=> {
              console.log(response)
          })
          .catch((error)=> {
              console.log(error);
          });
  }

  function gimbal(direction){
    axios.get(path+'/gimbalMove',
            {
                params: {
                  direction: direction
                }      
              })
          .then((response)=> {
              console.log(response)
          })
          .catch((error)=> {
              console.log(error);
          });
  }

  function stop(stop){
    axios.get(path+'/stop',
            {
                params: {
                  stop: stop
                }      
              })
          .then((response)=> {
              console.log(response)
          })
          .catch((error)=> {
              console.log(error);
          });
  }

  function manual(status){
    axios.get(path+'/manual', 
            {
                params: {
                  status: status
                }      
              })
          .then((response)=> {
              console.log(response)
          })
          .catch((error)=> {
              console.log(error);
          });
  }

  function sendData(){
    let message = ''
    for(let i=0;i<wayPoints.length; i++){
      message += i+'  '+wayPoints[i]+'\n'
    }
    alert("Way Points: "+wayPoints.length+ "\n"+message)

    // console.log(wayPoints)
    let wayPointsJSON = JSON.stringify(wayPoints)
    // console.log(wayPointsJSON)
    // ?????? ?????????
    axios.get(path+'/info', 
            {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              } 
            }, 
            {
                params: {
                  wayPoints: wayPointsJSON
                }      
              })
          .then((response)=> {
              console.log(response)
          })
          .catch((error)=> {
              console.log(error);
          });
  }
  function takeOff(param){
    // take off
    axios.get(path+'/takeOff',
      {
        params: {
          takeOff: param
        }      
      })
    .then((response)=> {
        console.log(response)
    })
    .catch((error)=> {
        console.log(error);
    });

  }

  function landing(param){
    // landing
    axios.get(path+'/landing',
        {
          params: {
            landing: param
          }      
        })
    .then((response)=> {
        console.log(response)
    })
    .catch((error)=> {
        console.log(error);
    });
  }

  function handleChange(e){
    // setAltitude(e.target.value)
    console.log(e.target.value)
    console.log("altitude")
    console.log(altitude)
    for(let i=0; i<wayPoints.length; i++){
      setAltitude(altitude => [...altitude, e.target.value])
    }
  };

  function sendGimbal(){
    const roll = rollRef.current.value;
    const pitch = pitchRef.current.value;
    const yaw = yawRef.current.value;
    let arr = []
    arr.push(roll)
    arr.push(pitch)
    arr.push(yaw)

    // var formData = new FormData();
    // formData.append('roll', roll);
    // formData.append('pitch', pitch);
    // formData.append('yaw', yaw);

    console.log(roll, pitch, yaw)
    console.log('123')
    axios.get(path+'/rollPitchYaw', 
          {
            params: JSON.stringify({
              rollPitchYaw: arr
            })      
          })
    .then((response)=> {
        console.log(response)
    })
    .catch((error)=> {
        console.log(error);
    });
  }

  useEffect(() => {
    let mapContainer = document.getElementById('map');
    let mapOption = { 
      center: new kakao.maps.LatLng(37.5214774, 126.9718877), // ????????? ????????????
      level: 3 // ????????? ?????? ??????
    };

    const map = new kakao.maps.Map(mapContainer, mapOption)

    kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
      // ????????? ??????, ?????? ????????? ??????????????? 
      var latlng = mouseEvent.latLng;
      // console.log(latlng)
      setWayPoints(wayPoints =>[...wayPoints, latlng])
      console.log(wayPoints)
    });

    // ????????? ????????? ??????
    var polyline = new kakao.maps.Polyline({
      path: wayPoints, // ?????? ???????????? ???????????? ?????????
      strokeWeight: 5, // ?????? ?????? ?????????
      strokeColor: '#FFAE00', // ?????? ???????????????
      strokeOpacity: 0.7, // ?????? ???????????? ????????? 1?????? 0 ????????? ????????? 0??? ??????????????? ???????????????
      strokeStyle: 'solid' // ?????? ??????????????????
    });
    polyline.setMap(map);  

    var markers = [];
    for(let i=0; i<wayPoints.length; i++){
      marker = new kakao.maps.Marker({
        map: map, // ????????? ????????? ??????
        position: wayPoints[i], // ????????? ????????? ??????
        title : wayPoints[i].title, // ????????? ?????????, ????????? ???????????? ????????? ???????????? ???????????????
      });
      markers.push(marker);

      var content = document.createElement('div');
      content.className = 'overlay';
      content.innerHTML = '<div style="background-color: white; color: red">'+(i+1)+'</div>';
      var customoverlay = new kakao.maps.CustomOverlay({
        map: map,
        content: content,
        position: wayPoints[i]
      });
      var infowindow = new kakao.maps.InfoWindow({
        content: "<div>lat: "+wayPoints[i].getLat()+ "<br>lng: "+wayPoints[i].getLng()+"??? ?????????????????????????<br></div>"+
                "<div>?????????????????? ????????? ??????????????????.</div>"
      });
      customoverlay.setPosition(wayPoints[i])
      kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
      kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));

      kakao.maps.event.addListener(marker, 'click', function() {
        console.log("clicked"+[i]);
        hideMarkers(i);

      });
    }
    function hideMarkers(i) {
      setMarkers(i, null);    
    }
    function setMarkers(idx, map) {
      console.log(idx)
      let tempArr = [];
      for(let i=0; i<wayPoints.length; i++){
        if(i != idx){
          tempArr.push(wayPoints[i])
        }
      }

      setWayPoints(tempArr)
      console.log("wayPointsssss: ", wayPoints)
    }

    function makeOverListener(map, marker, infowindow) {
      return function() {
          infowindow.open(map, marker);
      };
    }
    
    // ?????????????????? ?????? ???????????? ????????? ??????????????? 
    function makeOutListener(infowindow) {
        return function() {
            infowindow.close();
        };
    }
    
    // getMessages();
    // console.log("aaaa")
    // console.log(wayPoints)

  },[wayPoints, marker, messages.length])


  return (
      <div>
        <br/>
        <div id="map" style={mapStyles}/>
        <div style={textStyles}>
          {/* <button onClick={sendData}>Way Points ?????????</button>
          <button onClick={() => takeOff('takeoff')}>Take Off</button>
          <button onClick={() => landing('landing')}>Landing</button><br/><br/> */}
          <Button style={{ backgroundColor: "#4A4EB2", fontSize: "14px", marginBottom: '10px'}} onClick={sendData} variant="contained">Way Points ?????????</Button>
          &nbsp;
          <Button style={{ backgroundColor: "#4A4EB2", fontSize: "14px", marginBottom: '10px'}} onClick={() => takeOff('takeoff')} variant="contained">Take Off</Button>
          &nbsp;
          <Button style={{ backgroundColor: "#4A4EB2", fontSize: "14px", marginBottom: '10px'}} onClick={() => takeOff('landing')} variant="contained">Landing</Button>
          <div>
            {/* <button onClick={() => manual('manual')}>?????????</button>
            <button onClick={() => manual('auto')}>??????</button>
            <button style={{backgroundColor:"red", color: "white"}} onClick={() => stop('stop')}>STOP</button> */}
            <Button style={{ backgroundColor: "#7D81E5", fontSize: "14px"}} onClick={() => manual('manual')} variant="contained">?????????</Button>
            &nbsp;
            <Button style={{ backgroundColor: "#7D81E5", fontSize: "14px"}} onClick={() => manual('auto')} variant="contained">??????</Button>
            &nbsp;
            <Button style={{ backgroundColor: "#FF7060", fontSize: "14px"}} onClick={() => stop('stop')} variant="contained">STOP</Button>
            <br/><br/>
            {/* <div style={{border: '1px solid red', display: 'inline-block'}}>
            <h3>??????</h3>
              <img style={iconStyles} src='./icons/up.png' onClick={() => directionMove('up')}></img><br/>
              <img style={iconStyles} src='./icons/down.png' onClick={() => directionMove('down')}></img><br/>
              <img style={iconStyles} src='./icons/right-rotate.png' onClick={() => directionMove('cw')}></img>
              <img style={iconStyles} src='./icons/up-arrow.png' onMouseDown={() => directionMove('forward')}></img>
              <img style={iconStyles} src='./icons/left-rotate.png' onClick={() => directionMove('ccw')}></img><br />
              <img style={iconStyles} src='./icons/left-arrow.png' onClick={() => directionMove('left')}></img>
              <img style={iconStyles} src='./icons/down-arrow.png' onClick={() => directionMove('backward')}></img>
              <img style={iconStyles} src='./icons/right-arrow.png' onClick={() => directionMove('right')}></img><br/>
            </div>
            <div style={{border: '1px solid red', marginLeft: '10px', display: 'inline-block'}}>
              <h3>??????</h3>
              <img style={iconStyles1} src='./icons/up-arrow.png' onMouseDown={() => gimbal('pitchForward')}></img><br></br>
              <img style={iconStyles} src='./icons/left-arrow.png' onClick={() => gimbal('yawLeft')}></img>
              <img style={iconStyles} src='./icons/down-arrow.png' onClick={() => gimbal('pitchBackward')}></img>
              <img style={iconStyles} src='./icons/right-arrow.png' onClick={() => gimbal('yawRight')}></img><br/>
            </div> */}
            <table style={{'textAlign': 'center'}}>
              <tbody>
                <tr>
                  <th><h3>??????</h3></th>
                  <th><h3>??????</h3></th>
                </tr>
                <tr>
                  <td style={{'width': '200px'}}>
                  {/* <h3>??????</h3> */}
                    <img style={iconStyles} src='./icons/right-rotate.png' onClick={() => directionMove('cw')}></img>
                    <img style={iconStyles} src='./icons/up-arrow.png' onMouseDown={() => directionMove('forward')}></img>
                    <img style={iconStyles} src='./icons/left-rotate.png' onClick={() => directionMove('ccw')}></img> &nbsp;
                    <img style={iconStyles} src='./icons/up.png' onClick={() => directionMove('up')}></img><br/>
                    <img style={iconStyles} src='./icons/left-arrow.png' onClick={() => directionMove('left')}></img>
                    <img style={iconStyles} src='./icons/down-arrow.png' onClick={() => directionMove('backward')}></img>
                    <img style={iconStyles} src='./icons/right-arrow.png' onClick={() => directionMove('right')}></img> &nbsp;
                    <img style={iconStyles} src='./icons/down.png' onClick={() => directionMove('down')}></img><br/>
                  </td>
                  <td style={{'width': '200px'}}>
                    {/* <h3>??????</h3> */}
                    <img style={iconStyles1} src='./icons/up-arrow.png' onMouseDown={() => gimbal('pitchForward')}></img><br></br>
                    <img style={iconStyles} src='./icons/left-arrow.png' onClick={() => gimbal('yawLeft')}></img>
                    <img style={iconStyles} src='./icons/down-arrow.png' onClick={() => gimbal('pitchBackward')}></img>
                    <img style={iconStyles} src='./icons/right-arrow.png' onClick={() => gimbal('yawRight')}></img><br/>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br/>
          <div>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">??????</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel value="??????" control={<Radio />} label="??????" />
                <FormControlLabel value="?????????" control={<Radio />} label="?????????" />
              </RadioGroup>
            </FormControl> &nbsp;
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">RTH</FormLabel>
              <Checkbox></Checkbox>
            </FormControl>
          </div>  
          <div>
            <TextField
              label="Roll"
              inputRef={rollRef}
              variant="standard"
              fullWidth
              style={{width: '100px' }}
            />&nbsp;
            <TextField
              label="Pitch"
              inputRef={pitchRef}
              variant="standard"
              fullWidth
              style={{width: '100px' }}
            />&nbsp;
            <TextField
              label="Yaw"
              inputRef={yawRef}
              variant="standard"
              fullWidth
              style={{width: '100px' }}
            />&nbsp;&nbsp;&nbsp;
            <Button style={{ backgroundColor: "#DADBE9", padding: '4px',color: 'black', fontSize: "11px", marginTop: "15px"}} onClick={sendGimbal} variant="contained">Gimbal??? ?????????</Button>
            
            {/* <button onClick={sendGimbal}>Gimbal??? ?????????</button><br/><br/> */}
          </div>
          <br/>
          {/* ??????: <input name="altitude" onChange={handleChange} type="text" id="altitude"/> */}
          <div>
            <table>
              <tbody>
                <tr>
                {
                  wayPoints.length!=0?
                  <>
                  <th> </th>
                  <th>??????</th>
                  <th>??????</th>
                  </>
                  :
                  <th></th>
                }
                  
                </tr>
                {wayPoints.map((wayPoint, index, source) => {
                  return (
                      <tr key={index}>
                        <td style={{'width': '25px'}}>{index+1}</td>
                        <td style={{'width': '170px'}}>{wayPoint.La}</td>
                        <td style={{'width': '170px'}}>{wayPoint.Ma}</td>
                        {/* , ??????: <input name="altitude" onChange={ (event) => console.log("onchange is triggered") } type="text" id="altitude"></input> */}
                      </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div></div>
        </div>
      </div>
  );
  
}