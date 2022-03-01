import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import io from 'socket.io-client'

function Coordinate(){
  const canvas = useRef(null);
  const [ctx, setCts] = useState(undefined);
  const [checkCtx, setCheckCts] = useState(undefined);
  const [coordinatePoints, setCoordinatePoints] = useState([]);
  const [showCoordinatePoints, setShowCoordinatePoints] = useState([]);
  const [originalCoordinatePoints, setOriginalCoordinatePoints] = useState([]);
  const [hover, setHover] = useState([]);
  const [streamData, setStreamData] = useState([]);
  const [battery, setBattery] = useState(0);
  const [batteryLevelStyle, setBatteryLevelStyle] = useState({});
  const [checkSent, setCheckSent] = useState(0);
  const [flag, setFlag] = useState(true);


  let path = "http://127.0.0.1:5000";
  // let path1 = "http://192.168.0.18:5001";

  const batteryContainer = {
    display: '-webkit-box',
    display: '-moz-box',
    display: '-ms-flexbox',
    display: '-webkit-flex',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '345px',
    marginTop: '20px'
  }; 

  const batteryOuter = {
    borderRadius: '3px',
    border: '1px solid #444',
    padding: '1px',
    width: '50px',
    height: '15px'
  }; 

  const batteryBump = {
    borderRadius: '1px',
    backgroundColor: '#444',
    margin: '0px',
    width: '2.5px',
    height: '7px'
  }; 

  // let batteryLevel = {
  //   borderRadius: '2px',
  //   backgroundColor: '#73AD21',
  //   width: {battery},
  //   height: '15px'
  // }; 


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
    // position: 'fixed',
    // display:'inline-block',
    paddingLeft: "10px"
  }; 

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

  const handleMouseMove = e => {
    let x = e.nativeEvent.offsetX-250;
    let y = e.nativeEvent.offsetY-250;
    if( x>0 && y<0){
      y = Math.abs(y)
    }else if(x<0 && y<0){
      y = Math.abs(y)
    }else if(x<0 && y>0){
      y = y * -1
    }else if(x>0 && y>0){
      y = y * -1
    }
    setHover([x, y])
  };

  function sendPoints(){
    let arr = []
    for(let i=0; i<coordinatePoints.length; i++){
      arr.push([coordinatePoints[i][0]['coordinate'][0]/50, coordinatePoints[i][0]['coordinate'][1]/50])
    }
    axios.get(path+'/getPoints', {
          params: JSON.stringify({
            meterPoints: arr
          })      
        })
    .then((response)=> {
        console.log(response)
    })
    .catch((error)=> {
        console.log(error);
    });
    
  }

  function realTimePoints(){
    axios.get(path+'/realTimePoints')
    .then((response)=> {
        console.log(response.data)
        let points = response.data
        setStreamData([points[0], points[1]])
    })
    .catch((error)=> {
        console.log(error);
    });
  }

  function getBattery(){
    axios.get(path+'/getBattery')
    .then((response)=> {
        console.log(response.data)
        let battery = (response.data/2).toString()+'px'
        console.log(battery)
        setBattery(response.data)
        setBatteryLevelStyle({
          borderRadius: '2px',
          backgroundColor: '#73AD21',
          width: battery,
          height: '15px'
        })
    })
    .catch((error)=> {
        console.log(error);
    });
  }

  function coordinatePoint(e){
    let clientX = e.clientX;
    let clientY = e.clientY;
    let offsetX = e.nativeEvent.offsetX;
    let offsetY = e.nativeEvent.offsetY;
    let x = e.nativeEvent.offsetX-250;
    let y = e.nativeEvent.offsetY-250;
    if( x>0 && y<0){
      y = Math.abs(y)
    }else if(x<0 && y<0){
      y = Math.abs(y)
    }else if(x<0 && y>0){
      y = y * -1
    }else if(x>0 && y>0){
      y = y * -1
    }
    setCoordinatePoints(coordinatePoints => [...coordinatePoints, [{'coordinate': [x, y], 
                                                                    'offset': [offsetX, offsetY], 
                                                                    'client':[clientX, clientY],
                                                                    'xy':[e.clientX, e.clientY]}]])
  }

  function reverseCoordinatePoint(streamData){
    let x = streamData[0]
    let y = streamData[1]

    if( x>0 && y<0){
      y = y * -1
    }else if(x<0 && y<0){
      y = y * -1
    }else if(x<0 && y>0){
      y = y * -1
    }else if(x>0 && y>0){
      y = y * -1
    }
    x = x + 250
    y = y + 250

    setShowCoordinatePoints([x, y])
  }

  function deletePoint(idx){
    let tempArr = [];
    for(let i=0; i<coordinatePoints.length; i++){
      if(i != idx){
        tempArr.push(coordinatePoints[i])
      }
    }
    setCoordinatePoints(tempArr)
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
  }

  const drawLine = (info, style = {}) => {
    const { x, y, x1, y1 } = info;
    const { color = 'black', width = 1 } = style;
 
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function drawPointsAndLines(){
    var rect = canvas.current.getBoundingClientRect();
      for(let i=0; i<coordinatePoints.length; i++){
        ctx.fillStyle = 'red';
        ctx.fillRect(coordinatePoints[i][0]['client'][0] - rect.left, coordinatePoints[i][0]['client'][1] - rect.top, 10, 10);
        ctx.font = '20px serif';
        ctx.strokeText(i+1, coordinatePoints[i][0]['offset'][0], coordinatePoints[i][0]['offset'][1]);
      }
      if(coordinatePoints.length >1){
        for(let i=0; i<coordinatePoints.length-1; i++){
          drawLine({ x: coordinatePoints[i][0]['xy'][0] - rect.left, y: coordinatePoints[i][0]['xy'][1] - rect.top, x1: coordinatePoints[i+1][0]['xy'][0] - rect.left, y1: coordinatePoints[i+1][0]['xy'][1] - rect.top});
        }
      }
      setOriginalCoordinatePoints(coordinatePoints)
  }

  useEffect(() => {    
    if(streamData.length != 0){
      reverseCoordinatePoint(streamData)
    }
      // @ts-ignore
    setCts(canvas.current.getContext('2d'));
    setCheckCts(canvas.current.getContext('2d'));

    if((coordinatePoints.length != 0) && (originalCoordinatePoints.length!=coordinatePoints.length)){
      drawPointsAndLines();
    }
    if(showCoordinatePoints.length != 0){

      ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
      drawPointsAndLines();
      var rect = canvas.current.getBoundingClientRect();
      checkCtx.fillStyle = 'blue';
      checkCtx.fillRect(showCoordinatePoints[0], showCoordinatePoints[1], 10, 10);

    }
  }, [coordinatePoints, streamData, showCoordinatePoints]);

  // useEffect(() => {
  //   if(checkSent>0){
  //     setInterval(
  //       function connect(){
  //         console.log("socketttt")
  //         const socket = io.connect(path1)
  //         socket.on('connect', (data) => {
  //           if(data != undefined){
  //             console.log(data['point'][0], data['point'][1])
  //             setStreamData([data['point'][0], data['point'][1]])
  //           }else{
  //             setStreamData([])
  //           }
  //         })
  //       }, 3000 );
  //   }
  // },[checkSent]);

  useEffect(()=>{
    setInterval(realTimePoints, 3000);
  },[])

  useEffect(()=>{
    setInterval(getBattery, 5000);
  },[])

  return (
    <div>
      <div style={{display:'flex'}}>
        <p>10mx10m</p>
        <div style={batteryContainer}>
          <div style={{fontSize:"10px", width: '20px'}}>{battery}%</div>&nbsp;
          <div style={batteryOuter}><div style={batteryLevelStyle}></div></div>
          <div style={batteryBump}></div>
        </div>
      </div>
      <img src="./images/coordinate.png" style={{"position": "absolute", "width": "500px"}} />
      <canvas
        ref={canvas}
        // scr="./images/coordinate.png"
        width="500px"
        height="500px"
        onClick={coordinatePoint}
        style={{"position": "relative", "zIndex":1}}
        onMouseMove={handleMouseMove.bind(this)}
      />
      <div style={{position: 'fixed', display:'inline-block', }}>
        <div style={textStyles}>
            <Button style={{ backgroundColor: "#4A4EB2", fontSize: "14px", marginBottom: '10px'}} onClick={() => takeOff('tello_takeoff')} variant="contained">Take Off</Button>
            &nbsp;
            <Button style={{ backgroundColor: "#4A4EB2", fontSize: "14px", marginBottom: '10px'}} onClick={() => takeOff('tello_landing')} variant="contained">Landing</Button>
            {/* <button onClick={() => landing('tello_landing')}>Landing</button><br/><br/> */}
            <div>
              <Button style={{ backgroundColor: "#7D81E5", fontSize: "14px"}} onClick={() => manual('tello_manual')} variant="contained">매뉴얼</Button>
              &nbsp;
              <Button style={{ backgroundColor: "#7D81E5", fontSize: "14px"}} onClick={() => manual('tello_auto')} variant="contained">자동</Button>
              &nbsp;
              <Button style={{ backgroundColor: "#FF7060", fontSize: "14px"}} onClick={() => stop('tello_stop')} variant="contained">STOP</Button>
              <br/><br/>
              <table style={{'textAlign': 'center'}}>
                <tbody>
                  <tr>
                    <th><h3>드론</h3></th>
                    <th><h3>짐벌</h3></th>
                  </tr>
                  <tr>
                    <td style={{'width': '200px'}}>
                    {/* <h3>드론</h3> */}
                      <img style={iconStyles} src='./icons/right-rotate.png' onClick={() => directionMove('tello_cw')}></img>
                      <img style={iconStyles} src='./icons/up-arrow.png' onMouseDown={() => directionMove('tello_forward')}></img>
                      <img style={iconStyles} src='./icons/left-rotate.png' onClick={() => directionMove('tello_ccw')}></img> &nbsp;
                      <img style={iconStyles} src='./icons/up.png' onClick={() => directionMove('tello_up')}></img><br/>
                      <img style={iconStyles} src='./icons/left-arrow.png' onClick={() => directionMove('tello_left')}></img>
                      <img style={iconStyles} src='./icons/down-arrow.png' onClick={() => directionMove('tello_backward')}></img>
                      <img style={iconStyles} src='./icons/right-arrow.png' onClick={() => directionMove('tello_right')}></img> &nbsp;
                      <img style={iconStyles} src='./icons/down.png' onClick={() => directionMove('tello_down')}></img><br/>
                    </td>
                    <td style={{'width': '200px'}}>
                      {/* <h3>짐벌</h3> */}
                      <img style={iconStyles1} src='./icons/up-arrow.png' onMouseDown={() => gimbal('tello_pitchForward')}></img><br></br>
                      <img style={iconStyles} src='./icons/left-arrow.png' onClick={() => gimbal('tello_yawLeft')}></img>
                      <img style={iconStyles} src='./icons/down-arrow.png' onClick={() => gimbal('tello_pitchBackward')}></img>
                      <img style={iconStyles} src='./icons/right-arrow.png' onClick={() => gimbal('tello_yawRight')}></img><br/>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* <div style={{border: '1px solid red', display: 'inline-block'}}>
              <h3>드론</h3>
                <img style={iconStyles} src='./icons/up.png' onClick={() => directionMove('tello_up')}></img><br/>
                <img style={iconStyles} src='./icons/down.png' onClick={() => directionMove('tello_down')}></img><br/>
                <img style={iconStyles} src='./icons/right-rotate.png' onClick={() => directionMove('tello_cw')}></img>
                <img style={iconStyles} src='./icons/up-arrow.png' onMouseDown={() => directionMove('tello_forward')}></img>
                <img style={iconStyles} src='./icons/left-rotate.png' onClick={() => directionMove('tello_ccw')}></img><br />
                <img style={iconStyles} src='./icons/left-arrow.png' onClick={() => directionMove('tello_left')}></img>
                <img style={iconStyles} src='./icons/down-arrow.png' onClick={() => directionMove('tello_backward')}></img>
                <img style={iconStyles} src='./icons/right-arrow.png' onClick={() => directionMove('tello_right')}></img><br/>
              </div>
              <div style={{border: '1px solid red', marginLeft: '10px', display: 'inline-block'}}>
                <h3>짐벌</h3>
                <img style={iconStyles1} src='./icons/up-arrow.png' onMouseDown={() => gimbal('tello_pitchForward')}></img><br></br>
                <img style={iconStyles} src='./icons/left-arrow.png' onClick={() => gimbal('tello_yawLeft')}></img>
                <img style={iconStyles} src='./icons/down-arrow.png' onClick={() => gimbal('tello_pitchBackward')}></img>
                <img style={iconStyles} src='./icons/right-arrow.png' onClick={() => gimbal('tello_yawRight')}></img><br/>
              </div> */}
            </div>
            
              {/* <button onClick={() => manual('tello_manual')}>매뉴얼</button>
              <button onClick={() => manual('tello_auto')}>자동</button>
              <button style={{backgroundColor:"red", color: "white"}} onClick={() => stop('tello_stop')}>STOP</button> */}
            <div></div>
          </div>
          <br/>
        <div style={{paddingLeft: "10px", width: '370px'}}>
        {coordinatePoints.length!=0 ?<div><Button style={{ backgroundColor: "#DADBE9", padding: '5px', color: 'black', fontSize: "12px", float:'right'}} onClick={sendPoints} variant="contained">좌표 값 보내기</Button></div> :  <div></div>}
          {/* <br/> */}
          <table style={{textAlign: 'center', display: 'inline-block'}}>
              <thead>
                {coordinatePoints.length!=0
                  ?
                  <tr>
                    <th></th>
                    <th>(x, y)</th>
                    <th>m</th>
                  </tr>
                  :
                  <tr>
                    <th></th>
                  </tr>
                }
              </thead>
              <tbody>
              {coordinatePoints.map((point, index, source) => {
                return (
                  <tr key={index}>
                    <td style={{'width': '10px'}}>{index+1}</td>
                    <td style={{'width': '130px'}}>({point[0]['coordinate'][0]}, {point[0]['coordinate'][1]})</td>
                    <td style={{'width': '130px'}}>({point[0]['coordinate'][0]/50}m, {point[0]['coordinate'][1]/50}m)</td>
                    {/* <td><input type="button" value="delete" onClick={() => deletePoint(index)}></input></td> */}
                    <td style={{'width': '100px'}}><Button style={{ backgroundColor: "#F5F6FB", float: 'right', padding: '1px',color: 'black', fontSize: "10px", boxShadow: "none", border: '1px solid black'}} onClick={() => deletePoint(index)} variant="contained">delete</Button></td>
                  </tr>
                )
              })}
              </tbody>
          </table>
        </div>
      </div>
      <p style={{fontSize: "20px"}}>x좌표: {hover[0]}, y좌표: {hover[1]}</p>
      
    </div>
    )
}

export default Coordinate;