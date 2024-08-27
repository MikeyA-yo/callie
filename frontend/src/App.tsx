import { useState } from "react";
import "./App.css";
import {
  OpenFile,
  Read,
  Stats,
  Write,
} from "../wailsjs/go/main/App";
import Peer from "peerjs";
// const peer = new RTCPeerConnection( {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]});
export const peer = new Peer();

function App() {
  const [camStream, setCamStream] = useState<MediaStream | null>();
  //const [screenStream, setScreenStream] = useState<MediaStream | null>();
  // const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [id, setId] = useState("")
  const [audio, setAudio] = useState(false);
  const [file, setFile] = useState("");
  const [remoteId, setRemoteId] = useState("")
  const [mp4, setMp4] = useState(false);
  const [image, setImage] = useState(false);
  const [remIds, setRemIds] = useState<string[]>([])
  const cam:HTMLVideoElement = document.getElementById("userCam") as HTMLVideoElement;
 // const remoteCam = document.getElementById("remoteCam") as HTMLVideoElement;
  const streams = document.getElementById("streams") as HTMLDivElement;
  async function write() {
    const readData = await Read(file);
    const stats = await Stats(file);
    await Write(stats.name, readData);
  }
  
  async function Open() {
    let file = await OpenFile();
    if (file.length === 0) {
      return;
    }
    const stats = await Stats(file);
    const fileName = stats.name;
    const fileType = fileName.split(".").slice(-1)[0];
    switch (fileType) {
      case "png":
      case "jpg":
      case "jpeg":
      case "webp":
      case "bmp":
      case "svg":
        setImage(true);
        setMp4(false);
        setAudio(false);
        break;
      case "mp4":
      case "mkv":
      case "mov":
      case "webm":
      case "flv":
      case "vob":
      case "ogv":
      case "gif":
      case "drc":
      case "avi":
      case "amv":
        setMp4(true);
        setImage(false);
        setAudio(false);
        break;
      case "txt":
        alert("text");
        break;
      case "mp3":
      case "ogg":
      case "m4a":
      case "wav":
      case "aac":
      case "opus":
        setAudio(true);
        setImage(false);
        setMp4(false);
        break;
      default:
        setImage(false);
        setMp4(false);
        setAudio(false);
        alert(fileType);
        break;
    }
    setFile(file);
  }
  
  peer.on("open", id =>{
    setId(id)
  });
  peer.on("call", call=>{
    if(camStream){
       call.answer(camStream)
       call.on("stream", stream =>{
        
        addUser(stream, call.peer)
       })
    }
  })

  async function call(id: string){
    if(camStream){
      const conn = peer.call(id, camStream as MediaStream);
      conn.on("stream", stream =>{
        // setRemoteStream(stream);
        // remoteCam.srcObject = stream
        
        addUser(stream, id)
      })
    }
  }
  function addUser(stream:MediaStream, id:string){
    const existing = document.getElementById(id)
    if (!existing){
      const video = document.createElement("video");
      video.autoplay = true;
      video.controls = false;
      video.className = "max-h-40 max-w-40";
      video.id = id;
      video.srcObject = stream;
      streams.appendChild(video);
    }
  }
  async function loadScreen(){
    const media = await navigator.mediaDevices.getDisplayMedia({
      video:true,
    });
    //setScreenStream(media);
    cam.srcObject = media 
  }
  return (
    <div className="bg-gray-400 text-slate-800 h-screen overflow-auto flex flex-col items-center gap-4 justify-center">
      {image && file && (
        <img
          src={encodeURIComponent(file)}
          alt="image of what you put"
          className="h-44 w-44"
        />
      )}
      {mp4 && file && (
        <video
          src={encodeURIComponent(file)}
          controls
          className="h-96 w-96"
        ></video>
      )}
      {audio && file && (
        <audio
          src={encodeURIComponent(file)}
          controls
          className="max-h-96 max-w-96"
        ></audio>
      )}
      <div className="flex gap-4">
        <button
          onClick={() => {
            Open();
          }}
        >
          Open File
        </button>
        <button
          onClick={() => {
            write();
          }}
        >
          {" "}
          Save content
        </button>
      </div>
      <div className="flex flex-col gap-2">
        Call a user your id: {id}
        <input className="p-2" onChange={(e)=>{
          setRemoteId(e.target.value)
        }} />
        <button className="p-2" onClick={()=> call(remoteId)}>Call</button>
      </div>
      <div className="flex flex-col gap-4">
        {camStream && <button onClick={()=>{
            const cam =  document.getElementById("userCam") as HTMLVideoElement;
            const stream = cam.srcObject as MediaStream
            const tracks = stream.getTracks();
            tracks.forEach((track)=>{
                track.stop();
            })
            cam.srcObject = null
            setCamStream(null)
        }}>Close Camera</button>}
        <div className="flex gap-2" id="streams"> 
          <video autoPlay controls={false}  playsInline id="userCam" className="max-h-40 max-w-40" muted />
          {/* <video autoPlay controls={false} playsInline id="remoteCam" className="max-h-40 max-w-40" /> */}
        </div>
        <button onClick={()=>{
            async function LoadCam() {
                try {
                    const media = await navigator.mediaDevices.getUserMedia({audio:true, video:true});
                    setCamStream(media)
                   if(!cam){
                    return
                   }
                   if(media){
                    cam.srcObject = media as MediaProvider
                   }else{
                    cam.srcObject = await navigator.mediaDevices.getUserMedia({audio:true, video:true}) as MediaProvider
                   }
                } catch (e:any) {
                    alert(e.message)
                }
            }
            LoadCam();
        }}>
            Open Camera
        </button>
        <button onClick={()=>{
          loadScreen()
        }}>
          Share Screen
          </button>
      </div>
    </div>
  );
}

export default App;
