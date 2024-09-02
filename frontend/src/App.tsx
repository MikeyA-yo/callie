import { useEffect, useState } from "react";
import "./App.css";
import {
  OpenFile,
  Read,
  Stats,
  Write,
} from "../wailsjs/go/main/App";
import Peer from "peerjs";
import { io } from "socket.io-client";
import MediaView from "./components/media";
// const peer = new RTCPeerConnection( {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]});
export const peer = new Peer();
const socket = io(import.meta.env.VITE_SOCK_URL as string);
function App() {
  const [camStream, setCamStream] = useState<MediaStream | null>();
  const [id, setId] = useState("")
  const [audio, setAudio] = useState(false);
  const [file, setFile] = useState("");
  const [remoteId, setRemoteId] = useState("")
  const [mp4, setMp4] = useState(false);
  const [image, setImage] = useState(false);
  //const [remIds, setRemIds] = useState<string[]>([])
  const cam:HTMLVideoElement = document.getElementById("userCam") as HTMLVideoElement;
  const streams = document.getElementById("streams") as HTMLDivElement;
  async function write() {
    const readData = await Read(file);
    const stats = await Stats(file);
    await Write(stats.name, readData);
  }
  socket.on("joined", (id:string)=>{
    call(id)
  });
  socket.on("user-disconnected", (id: string)=>{
    document.getElementById(id)?.remove()
  })
 function joinRoom(roomId:string, userId:string){
    socket.emit("join-room", roomId, userId)
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

  function call(id: string){
    if(camStream){
      const conn = peer.call(id, camStream as MediaStream);
      conn.on("stream", stream =>{
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
  useEffect(()=>{
    if(camStream){
      cam.srcObject = camStream as MediaProvider;
    }
  }, [camStream]);
  async function loadCam() {
    try {
        const media = await navigator.mediaDevices.getUserMedia({audio:true, video:true});
       if(!cam){
        return
       }
       if(media){
        setCamStream(media)
        cam.srcObject = media as MediaProvider
       }else{
        let media = await navigator.mediaDevices.getUserMedia({audio:true, video:true});
        if(media){
          setCamStream(media)
          cam.srcObject = media  as MediaProvider;
        }else{
          let media = await navigator.mediaDevices.getUserMedia({audio:true, video:true});
          if(media){
            setCamStream(media)
            cam.srcObject = media  as MediaProvider;
          }else{
            cam.srcObject = await navigator.mediaDevices.getUserMedia({audio:true, video:true}) as MediaProvider;
          }
        }
       }
    } catch (e:any) {
        alert(e.message)
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
      <div className="flex gap-4">
         <MediaView open={()=>{
          Open()
         }}
         file={file}
         mp4={mp4}
         image={image}
         audio={audio}
         save={()=>{
          write()
         }}
         />
      </div>
      <div className="flex flex-col gap-2">
        Call a user your id: {id},
        Enter Room Address:
        <input className="p-2" onChange={(e)=>{
          setRemoteId(e.target.value)
        }} />
        <button className="p-2" onClick={()=>{
          joinRoom(remoteId, id)
        }}>Call</button>
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
        </div>
        <button onClick={()=>{
        
            loadCam();
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
