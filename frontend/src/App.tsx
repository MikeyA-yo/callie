import { useEffect, useRef, useState } from "react";
import "./App.css";
import { OpenFile, ShowInfo, Stats, GetUser } from "../wailsjs/go/main/App";
import Peer from "peerjs";
import { io } from "socket.io-client";
import MediaView from "./components/media";
import ChatView, { ChatIcon } from "./components/chats";
import Starters, { Mute, OffCam } from "./components/starters";
import { UserIntro } from "./components/userinfo";
import { EndCall, VidDivs } from "./components/vids";
import {
  ChatPopUp,
  SchedulePop,
  SelfCam,
  UpcomingPop,
} from "./components/pops";
import { UserAvatar } from "./components/svgs";
// const peer = new RTCPeerConnection( {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]});
//(import.meta.env.VITE_SOCK_URL as string)"http://localhost:3000"
export const peer = new Peer();
const socket = io(
  (import.meta.env.VITE_SOCK_URL as string) ??
    "https://callie-rooms.onrender.com/"
);

function App() {
  //This is a very terrible way to write react code, don't do this
  //I didn't know this would escalate into something so large
  //I repeat never write code as ugly as this.
  const [camStream, setCamStream] = useState<MediaStream | null>();
  const [screenStream, setScreenStream] = useState<MediaStream | null>();
  const [remoteStreams, setRStreams] = useState<MediaStream[]>([]);
  const [id, setId] = useState("");
  const [audio, setAudio] = useState(false);
  const [file, setFile] = useState("");
  const [remoteId, setRemoteId] = useState("");
  const [mp4, setMp4] = useState(false);
  const [image, setImage] = useState(false);
  const [chats, setChats] = useState<string[]>([]);
  const [chat, setChat] = useState("");
  const [me, setMe] = useState<Array<boolean>>([]);
  const [media, setMedia] = useState(false);
  const [conns, setConns] = useState<Array<Particpant>>([]);
  const [join, setJoin] = useState(false);
  const [person, setPerson] = useState<any>();
  const [senders, setSenders] = useState<Array<string>>([]);
  const [muted, setMuted] = useState(false);
  const [offed, setOffed] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [pop, setPop] = useState(false);
  const [sPop, setSPop] = useState(false);
  const [uPop, setUPop] = useState(false);
  const [lPop, setLPop] = useState(false);
  const [pUsers, setPUsers] = useState<string[]>([]);
  const popupRef = useRef(null);
  const peers: any = {};
  const cam: HTMLVideoElement = document.getElementById(
    "userCam"
  ) as HTMLVideoElement;
  const streams = document.getElementById("streams") as HTMLDivElement;

  useEffect(() => {
    if (!navigator.onLine) {
      ShowInfo(
        "You need to be online to open camera and connect",
        "Info: Needs Internet"
      );
    }
    socket.on(
      "user-disconnected",
      (id: string, p: Particpant[], uname: string) => {
        peers[id] && peers[id].close();
        setConns(p);
        setPUsers((prev) => [...prev, uname]);
        setLPop(true);
        setTimeout(() => {
          setLPop(false);
        }, 4500);
      }
    );
    socket.on("data", (data, from) => {
      //todo /// thinking of not implementing this feature and turning it to chat box, pics may work tho
      setChats((prev) => [...prev, data]);
      setMe((prev) => [...prev, false]);
      setSenders((prev) => [...prev, from]);
      if (!document.getElementById("chats")) {
        setPop(true);
      }
      setTimeout(() => {
        setPop(false);
      }, 6000);
    });
    socket.on("muted", (id, val) => {
      if (document.getElementById(id)) {
        let vid = document.getElementById(id) as HTMLVideoElement;
        vid.muted = val;
      }
    });
    socket.on("offed", (id, val) => {
      if (document.getElementById(id)) {
        let vid = document.getElementById(id) as HTMLVideoElement;
        if (val) {
          vid.classList.add("hidden");
        } else {
          vid.classList.remove("hidden");
        }
      }
    });
    socket.on("updateP", (p) => {
      setConns(p);
    });
    async function loadUser() {
      let person = await GetUser();
      person.length > 4 && setPerson(JSON.parse(person));
    }
    loadUser();
  }, []);

  useEffect(() => {
    let container = document.getElementById("chats");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chats, me]);

  useEffect(() => {
    conns.map((p) => {
      let vid = document.getElementById(p.userId) as HTMLVideoElement;
      if (vid) {
        setJoin(false);
        vid.muted = p.muted;
        if (p.offed) {
          vid.classList.add("hidden");
        } else {
          vid.classList.remove("hidden");
        }
      }
    });
    if (!join) {
      conns.length > 0 && setJoin(false);
    }
  }, [conns]);
  function joinRoom(roomId: string, userId: string, uname: string) {
    socket.emit("join-room", roomId, userId, uname, muted, offed);
    socket.on("joined", (id: string) => {
      call(id);
    });
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
        break;
    }
    setFile(file);
  }
  peer.on("open", (id) => {
    setId(id);
  });
  peer.on("call", (call) => {
    if (camStream) {
      call.answer(camStream);
      call.on("stream", (stream) => {
        addUser(stream, call.peer);
        updateMediaStates();
      });
      peers[call.peer] = call;
    }
  });

  function call(id: string) {
    if (camStream) {
      const conn = peer.call(id, camStream as MediaStream);
      conn.on("stream", (stream) => {
        addUser(stream, id);
        updateMediaStates();
      });
      peers[id] = conn;
    }
  }

  function addUser(stream: MediaStream, id: string) {
    const existing = document.getElementById(id);
    if (!existing) {
      const video = document.createElement("video");
      video.autoplay = true;
      video.controls = false;
      video.className = "max-h-44 max-w-44";
      video.id = id;
      video.srcObject = stream;
      video.addEventListener("dblclick", () => {
        video.requestFullscreen();
      });
      let parent = document.getElementById(id.substring(0, id.indexOf("-")));
      parent?.insertBefore(video, parent.lastChild);
    }
  }
  function updateMediaStates() {
    conns.map((p) => {
      let vid = document.getElementById(p.userId) as HTMLVideoElement;
      if (vid) {
        vid.muted = p.muted;
        setJoin(false);
        if (p.offed) {
          vid.classList.add("hidden");
        } else {
          vid.classList.remove("hidden");
        }
      }
    });
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
    const cam = document.getElementById("userCam") as HTMLVideoElement;
    const stream = cam.srcObject as MediaStream;
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    socket.emit("close-cam");
    cam.srcObject = null;
    setCamStream(null);
  };
  async function loadScreen() {
    const media = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    setScreenStream(media);
  }
  return (
    <div className="bg-[#1E201E] text-[#ECDFCC] min-h-screen overflow-auto flex flex-col items-center gap-4 justify-evenly">
      <div>
        <h1 className="text-3xl">Chat and Stream Online</h1>
      </div>
      <UserIntro />
      {person && (
        <Starters
          close={() => {
            if (!camStream) {
              loadCam();
            } else {
              closeCam();
            }
          }}
          join={() => {
            setJoin(true);
          }}
          schedule={() => {
            if (person.username.length > 1) {
              setSPop(true);
              setUPop(false);
            } else {
              ShowInfo(
                "Your Details Needed Before you can schedule meetings",
                "Details needed"
              );
            }
          }}
          upc={() => {
            setUPop(true);
            setSPop(false);
          }}
          text={camStream ? "Close Camera" : "Open Camera"}
        />
      )}
      <div className="flex gap-4 w-full items-center p-4 justify-evenly max-h-[80%] overflow-auto">
        {sPop && (
          <SchedulePop cancel={() => setSPop(false)} uname={person.name} />
        )}
        {uPop && <UpcomingPop cancel={() => setUPop(false)} />}
        <div className="flex flex-col grow gap-4 p-2">
          {join && (
            <div
              className={`flex flex-col text-xl gap-2 ${
                !showChat ? "w-1/2" : ""
              }`}
            >
              Enter Room Address:
              <input
                className="p-2 text-[#697565] rounded"
                placeholder="my-room-adress"
                onChange={(e) => {
                  setRemoteId(e.target.value);
                }}
              />
              <div className="flex gap-2">
                <button
                  className="p-2 bg-[#3C3D37] grow"
                  onClick={() => {
                    joinRoom(remoteId, id, person.username);
                  }}
                >
                  Join Room
                </button>
                <button
                  className="p-2 bg-[#3C3D37] grow"
                  onClick={() => setJoin(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center gap-4">
            {pop && (
              <ChatPopUp
                from={senders[senders.length - 1]}
                message={chats[chats.length - 1]}
                show={() => {
                  setShowChat(true);
                  setPop(false);
                }}
              />
            )}
            {lPop && (
              <ChatPopUp
                from={pUsers[pUsers.length - 1]}
                message="left"
                show={() => {
                  setLPop(false);
                }}
              />
            )}
            <SelfCam>
              <div className="flex flex-col items-center gap-2">
                {camStream && <p>You</p>}
                <video
                  autoPlay
                  controls={false}
                  playsInline
                  id="userCam"
                  className={`max-h-44 max-w-44 rounded ${
                    offed ? "hidden" : ""
                  }`}
                  muted
                  onDoubleClick={(e) => {
                    e.currentTarget.requestFullscreen();
                  }}
                />
                {camStream && offed && (
                  <div className="p-2 bg-[#697565]">
                    <UserAvatar className="size-32" />
                  </div>
                )}
                {camStream && (
                  <div className="flex-col flex gap-3 items-center">
                    <div className="flex gap-1 items-center">
                      <Mute
                        mute={() => {
                          socket.emit("mute", peer.id, !muted);
                          setMuted(!muted);
                        }}
                        muted={muted}
                        cursor
                      />{" "}
                      <OffCam
                        off={() => {
                          socket.emit("off", peer.id, !offed);
                          setOffed(!offed);
                        }}
                        cursor
                        offed={offed}
                      />
                    </div>
                    <div
                      className="flex flex-col items-center gap-1 cursor-pointer"
                      onClick={() => setShowChat(!showChat)}
                    >
                      <ChatIcon />
                      <p>
                        {showChat && "Close chat"}
                        {!showChat && "Open Chat"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </SelfCam>
            <div
              className="flex gap-2 items-center justify-center max-w-[25rem] overflow-auto"
              id="streams"
            >
              <VidDivs participants={conns} id={id} />
            </div>
            {conns.length > 1 && (
              <EndCall
                end={() => {
                  let dConns = Object.values(peers);
                  let ids = Object.keys(peers);
                  ids.forEach((id) => {
                    document
                      .getElementById(id.slice(0, id.indexOf("-")))
                      ?.remove();
                  });
                  dConns.forEach((conn: any) => {
                    conn.close();
                  });
                  setConns([]);
                  socket.emit("leave");
                  window.location.reload();
                }}
              />
            )}
            {conns.length > 1 && "Leave Room"}
          </div>
        </div>
        {showChat && (
          <div className="p-4 flex flex-col grow gap-2">
            <h2 className="text-2xl"> Chat Box</h2>
            <ChatView
              chats={chats}
              me={me}
              senders={senders}
              input={(e) => {
                setChat(e.target.value);
              }}
              send={() => {
                socket.emit("chat", chat, person.username);
                setChats((prev) => [...prev, chat]);
                setMe((prev) => [...prev, true]);
                setSenders((prev) => [...prev, person.username]);
                if (document.getElementById("chat-input")) {
                  const input = document.getElementById(
                    "chat-input"
                  ) as HTMLInputElement;
                  input.value = "";
                }
              }}
              enterSend={(e) => {
                if (e.key === "Enter") {
                  socket.emit("chat", chat, person.username);
                  e.currentTarget.value = "";
                  setChats((prev) => [...prev, chat]);
                  setMe((prev) => [...prev, true]);
                  setSenders((prev) => [...prev, person.username]);
                }
              }}
            />
          </div>
        )}
        {media && (
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
        )}
      </div>
    </div>
  );
}
export interface Particpant {
  userId: string;
  uname: string;
  muted: boolean;
  offed: boolean;
}
export default App;
