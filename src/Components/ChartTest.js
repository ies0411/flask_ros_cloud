/* global kakao */
import React, { useEffect, useState, useRef } from 'react';
import {ScatterChart, CartesianGrid, XAxis, YAxis, ZAxis, Tooltip, Legend, Scatter} from 'recharts'
// import styled from "styled-components";
import axios from 'axios';


export default function ChartTest(props){
  const videoRef = useRef();
  const data01 = [
    {
      "x": 100,
      "y": 200,
      "z": 200
    },
    {
      "x": 120,
      "y": 100,
      "z": 260
    },
    {
      "x": 170,
      "y": 300,
      "z": 400
    },
    {
      "x": 140,
      "y": 250,
      "z": 280
    },
    {
      "x": 150,
      "y": 400,
      "z": 500
    },
    {
      "x": 110,
      "y": 280,
      "z": 200
    }
  ];
  const data02 = [
    {
      "x": 200,
      "y": 260,
      "z": 240
    },
    {
      "x": 240,
      "y": 290,
      "z": 220
    },
    {
      "x": 190,
      "y": 290,
      "z": 250
    },
    {
      "x": 198,
      "y": 250,
      "z": 210
    },
    {
      "x": 180,
      "y": 280,
      "z": 260
    },
    {
      "x": 210,
      "y": 220,
      "z": 230
    }
  ];
      
  // useEffect(() => {
  //   const video = videoRef.current;
  //   const chunks = 30;
  //   const videoFile = `http://127.0.0.1:5000/video`;
  //   console.log(videoFile)
  //   const mediaSource = new MediaSource();
  //   console.log('11111')
  //   mediaSource.addEventListener("sourceopen", e => {
  //     console.log("abc")
  //     const ms = mediaSource.addSourceBuffer(
  //       'video/mp4; codecs="avc1.4D4001,mp4a.40.2"'
  //     );
  //     console.log('222222 addeventListener')
  //     ms.addEventListener(
  //       "updateend",
  //       () => {
  //         if (i === chunks - 1) {
  //           return;
  //         }
  //         loadChunk(++i);
  //       },
  //       false
  //     );
  //     loadChunk(0);
  //   });
  //   console.log('333333 AddEventListener Done')
  //   mediaSource.addEventListener("sourceclose", () => {
  //     console.log("ended");
  //   });
  //   console.log(mediaSource)

  //   video.src = window.URL.createObjectURL(mediaSource);

  //   let i = 0;

  //   const loadChunk = async i => {
  //     console.log("aaaaa");
  //     const start = 0;
  //     const length = 30000000;

  //     const chunkSize = Math.ceil(length / chunks);
  //     const startByte = parseInt(start + chunkSize * i);

  //     const range =
  //       "bytes=" + start + chunkSize * i + "-" + (startByte + chunkSize - 1);

  //     const res = await fetch(videoFile, {
  //       headers: {
  //         Range: range,
  //       },
  //     }).then(res => {
  //       console.log("res")
  //       console.log(res)
  //       res.arrayBuffer()});

  //     mediaSource.sourceBuffers[0].appendBuffer(new Uint8Array(res));
  //   };
  // }, []);

  // useEffect(() => {
  //   const videoFile = `http://127.0.0.1:5000/video`;
  //   console.log(videoFile)
  //   axios.get(videoFile)
  //         .then((response)=> {
  //             console.log('abc')
  //             console.log(response)
  //         })
  //         .catch((error)=> {
  //             console.log(error);
  //         });
  // })

  return (
    <>
      <iframe
          src={'http://127.0.0.1:5000/video'}
          style={{width: '100%', height: '100%', position: 'absolute'}}
          allow="accelerometer, autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen>
      </iframe>
      {/* <div ref={videoRef} autoPlay muted width="100%" /> */}
      {/* <img ref={} /> */}
    </>
    // <ScatterChart width={1000} height={250} inRange={-10, 10}
    //   margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
    //   <CartesianGrid strokeDasharray="3 3" />
    //   <XAxis dataKey="x" unit="m" />
    //   <YAxis dataKey="y" unit="m" />
    //   <ZAxis dataKey="z" range={[64, 144]} name="score" unit="km" />
    //   <Tooltip cursor={{ strokeDasharray: '3 3' }} />
    //   <Legend />
    //   {/* <Scatter name="A school" data={data01} fill="#8884d8" />
    //   <Scatter name="B school" data={data02} fill="#82ca9d" /> */}
    // </ScatterChart>
  );
  // const VideoStream = styled.video`
  //   margin-top: -70px;
  // `;
}