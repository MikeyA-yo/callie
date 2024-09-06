import { useEffect, useState } from "react";
import "./App.css";
import { OpenFile, ShowInfo, Stats, Write, Read, GetString } from "../wailsjs/go/main/App";
import Peer from "peerjs";
import { io } from "socket.io-client";
import MediaView from "./components/media";
import ChatView from "./components/chats";
import Starters from "./components/starters";
// const peer = new RTCPeerConnection( {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]});

export const peer = new Peer();
const socket = io(import.meta.env.VITE_SOCK_URL as string ?? "https://callie-rooms.zeabur.app/");

function App() {
  const [camStream, setCamStream] = useState<MediaStream | null>();
  const [id, setId] = useState("");
  const [audio, setAudio] = useState(false);
  const [file, setFile] = useState("");
  const [remoteId, setRemoteId] = useState("");
  const [mp4, setMp4] = useState(false);
  const [image, setImage] = useState(false);
  const [chats, setChats] = useState<string[]>([]);
  const [chat, setChat] = useState("");
  const [me, setMe] = useState<Array<boolean>>([])
  const cam: HTMLVideoElement = document.getElementById(
    "userCam"
  ) as HTMLVideoElement;
  const streams = document.getElementById("streams") as HTMLDivElement;
  
  socket.on("joined", (id: string) => {
    call(id);
  });
  socket.on("user-disconnected", (id: string) => {
    document.getElementById(id)?.remove();
  });
  useEffect(()=>{
    if(!navigator.onLine){
      ShowInfo("You need to be online to open camera and connect", "Info")
    }
    socket.on("data", (data) => {
      //todo /// thinking of not implementing this feature and turning it to chat box, pics may work tho
      setChats((prev) => [...prev, data])
      setMe((prev) => [...prev, false])
    });
  }, [])
  
  useEffect(()=>{
    let container = document.getElementById("chats");
    if(container){
      container.scrollTop = container.scrollHeight;
    }
  }, [chats, me])
  function joinRoom(roomId: string, userId: string) {
    socket.emit("join-room", roomId, userId);
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
        ShowInfo(fileType + " is not supported", "Invalid");
        //printJson(file)
        break;
    }
    setFile(file);
  }
  async function printJson(n: string){
   let data = await Read(n);
   let jsson = await GetString(data);
   return jsson
  }
  peer.on("open", (id) => {
    setId(id);
  });
  peer.on("call", (call) => {
    if (camStream) {
      call.answer(camStream);
      call.on("stream", (stream) => {
        addUser(stream, call.peer);
      });
    }
  });
  function call(id: string) {
    if (camStream) {
      const conn = peer.call(id, camStream as MediaStream);
      conn.on("stream", (stream) => {
        addUser(stream, id);
      });
    }
  }
  
  function addUser(stream: MediaStream, id: string) {
    const existing = document.getElementById(id);
    if (!existing) {
      const video = document.createElement("video");
      video.autoplay = true;
      video.controls = false;
      video.className = "max-h-40 max-w-40";
      video.id = id;
      video.srcObject = stream;
      video.addEventListener("dblclick",()=>{
        video.requestFullscreen()
      })
      streams.appendChild(video);
    }
  }
  useEffect(() => {
    if (camStream) {
      cam.srcObject = camStream as MediaProvider;
    }
  }, [camStream]);
  
  async function loadCam() {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (!cam) {
        return;
      }
      if (media) {
        setCamStream(media);
        cam.srcObject = media as MediaProvider;
      } else {
        let media = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        if (media) {
          setCamStream(media);
          cam.srcObject = media as MediaProvider;
        } else {
          let media = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          if (media) {
            setCamStream(media);
            cam.srcObject = media as MediaProvider;
          } else {
            cam.srcObject = (await navigator.mediaDevices.getUserMedia({
              audio: true,
              video: true,
            })) as MediaProvider;
          }
        }
      }
    } catch (e: any) {
      ShowInfo(e.message + " Another app using webcam", "Error");
    }
  }
  const closeCam = () => {
    const cam = document.getElementById(
      "userCam"
    ) as HTMLVideoElement;
    const stream = cam.srcObject as MediaStream;
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    socket.emit("close-cam")
    cam.srcObject = null;
    setCamStream(null);
  }
  async function loadScreen() {
    const media = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    //setScreenStream(media);
    cam.srcObject = media;
  }
  return (
    <div className="bg-[#1E201E] text-[#ECDFCC] min-h-screen overflow-auto flex flex-col items-center gap-4 justify-evenly">
      <div>
        <h1 className="text-3xl">Chat and Stream Online</h1>
      </div>
      <Starters close={()=>{
        if(!camStream){
          loadCam();
        }else{
          closeCam()
        }
      }} join={()=>{}} schedule={()=>{}} text={camStream ? "Close Camera" :"Open Camera"}/>
      <div className="flex gap-4 w-full items-center p-4 justify-evenly max-h-[80%] overflow-auto">
        <div className="flex flex-col grow gap-4 p-2">
          <div className="flex flex-col text-xl gap-2">
            Enter Room Address:
            <input
              className="p-2 text-[#697565] rounded"
              onChange={(e) => {
                setRemoteId(e.target.value);
              }}
            />
            <button
              className="p-2 bg-[#3C3D37]"
              onClick={() => {
                joinRoom(remoteId, id);
              }}
            >
              Join Room
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center justify-center overflow-auto" id="streams">
              <video
                autoPlay
                controls={false}
                playsInline
                id="userCam"
                className="max-h-40 max-w-40"
                muted
                onDoubleClick={(e)=>{
                  e.currentTarget.requestFullscreen()
                }}
              />
            </div>
            <button
            className="p-2 bg-[#3C3D37]"
              onClick={() => {
                loadCam();
              }}
            >
              Open Camera
            </button>
            <button
            className="p-2 bg-[#3C3D37]"
              onClick={() => {
                loadScreen();
              }}
            >
              Share Screen
            </button>
          </div>
        </div>
        <div className="p-4 flex flex-col grow gap-2">
          <h2 className="text-2xl"> Chat Box</h2>
          <ChatView chats={chats} me={me} input={(e)=>{
            setChat(e.target.value)
          }} send={()=>{
            socket.emit("chat", chat)
            setChats(prev => [...prev, chat])
            setMe(prev => [...prev, true])
          }} enterSend={(e)=>{
             if(e.key === "Enter"){
              socket.emit("chat", chat)
              setChats(prev => [...prev, chat])
              setMe(prev => [...prev, true])
             }
          }}/>
        </div>
        <div className="p-4 flex flex-col grow gap-2">
          <h2 className="text-2xl">Media Display</h2>
          <div className="max-h-96 max-w-96 p-4 bg-[#3C3D37] overflow-auto">
            <MediaView
              open={() => {
                Open();
              }}
              file={file}
              mp4={mp4}
              image={image}
              audio={audio}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
