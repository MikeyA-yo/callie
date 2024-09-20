import { useState, useEffect } from "react";
import {
  AddMeeting,
  DeleteSch,
  GetMeetings,
  Schedule,
  Schedule2,
} from "../../wailsjs/go/main/App";
import { Spinner, Tick, XMark } from "./svgs";

export function ChatPopUp({
  message,
  from,
  show,
}: {
  from: string;
  message: string;
  show: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <>
      <div
        className="top-2/3 p-4 right-1/2 fixed z-10 rounded bg-[#3C3D37] flex flex-col gap-2"
        onClick={show}
      >
        <p className="self-end text-sm">{from}</p>
        <p className="text-md">{message}</p>
      </div>
    </>
  );
}

export function SelfCam({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="top-4 right-4 fixed z-10">{children}</div>
    </>
  );
}

export function SchedulePop({
  cancel,
  uname,
}: {
  cancel?: React.MouseEventHandler<HTMLButtonElement>;
  uname: string;
}) {
  const [data, setData] = useState({ id: "", exp: 0 });
  const [time, setTime] = useState(0);
  const [load, setLoad] = useState(false);
  const [a, b] = useState(false);
  const [c, d] = useState(false);
  const [e, f] = useState("");
  const [g, h] = useState<string>()
  useEffect(() => {
    (async function () {
      let meetings = await GetMeetings();
      f(meetings);
    })();
  }, []);
  async function schedule(data: { id: string; exp: number }) {
    setLoad(true);
    let val = await Schedule(data.exp, uname, data.id);
    setLoad(false);
    if(time < Date.now()){
      h("Date and Time Can't be in the past");
      d(true)
      return
    }
    if (val === false) {
      h("Schedule Already Exists")
      d(true);
    } else {
      if (e.includes("meetings")) {
        let meetingArray = JSON.parse(e).meetings;
        meetingArray.push({ roomId: data.id, expiryDate: data.exp });
        let meetObj = {
          meetings: meetingArray,
        };
        AddMeeting(JSON.stringify(meetObj));
      } else {
        AddMeeting(
          JSON.stringify({
            meetings: [{ roomId: data.id, expiryDate: data.exp }],
          })
        );
      }
    }
    b(val);
  }
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }
  return (
    <>
      <div className="fixed top-1/2 z-20 bg-[#697565] transform -translate-x-1/2 -translate-y-1/2 left-1/2">
        <div className="flex flex-col p-4 gap-2">
          {a && <Success />}
          {c && !a && !g && <E />}
          {c && !a && g && <E text={g} />}
          <h3 className="text-xl">Schedule a new meeting</h3>
          <div className="flex flex-col gap-2">
            <p>Enter Desired ID:</p>
            <input
              className="p-2 text-[#697565]"
              name="id"
              onChange={handleInput}
              placeholder="Room ID of your choice"
            />
            <p>Input Date and Time</p>
            <input
              className="p-2 text-[#697565]"
              onChange={(e) => {
                setTime(new Date(e.target.value).getTime());
                setData((prev) => {
                  return {
                    ...prev,
                    exp: new Date(e.target.value).getTime(),
                  };
                });
              }}
              type="datetime-local"
              min={new Date().toISOString()}
            />
            <button
              onClick={() => {
                schedule(data);
              }}
              className="flex gap-2 justify-between p-2 bg-[#3C3D37]"
            >
              Schedule {load && <Spinner className="animate-spin size-6" />}
            </button>
            <button onClick={cancel} className="flex p-2 bg-[#3C3D37]">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Success() {
  return (
    <>
      <div className="bg-green-500 flex gap-2 items-center justify-around p-3">
        Schedule Created{" "}
        <Tick className="size-6 border-[#697565] rounded border p-1" />
      </div>
    </>
  );
}
function E({text}:{text?:string}) {
  return (
    <>
      <div className="bg-red-500 flex gap-2 items-center justify-around p-3">
        {!text && "Schedule failed to create, this ID already exists or network issue"}
        {text && text}
        <XMark className="size-6 border-[#697565] rounded border p-1" />
      </div>{" "}
    </>
  );
}

export function UpcomingPop({
  cancel,
}: {
  cancel?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const [meetings, setMeetings] = useState("");
  const [meetAr, setmeetAr] = useState<Array<any>>([]);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    (async function () {
      const gM = await GetMeetings();
      setMeetings(gM);
      if (gM.length > 4) {
        setmeetAr(JSON.parse(gM).meetings);
        JSON.parse(gM).meetings.map(
          (meeting: { roomId: string; expiryDate: number }) => {
            if (meeting.expiryDate < Date.now()) {
              deleteSch(meeting.roomId);
            }
          }
        );
      }
    })();
  }, []);
  async function deleteSch(id: string) {
    setLoad(true);
    await DeleteSch(id);
    setLoad(false);
    let updatedArr = meetAr.filter((meet) => meet.roomId !== id);
    setmeetAr((prev) => prev.filter((pre) => pre.roomId !== id));
    AddMeeting(JSON.stringify({ meetings: updatedArr }));
  }
  return (
    <>
      <div className="fixed top-1/2 z-20 p-4 bg-[#697565] transform -translate-x-1/2 -translate-y-1/2 left-1/2">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl"> Meetings:</h1>
          {load && <Spinner className="animate-spin size-6" />}
          {meetAr.length > 0 &&
            meetAr.map((meet, i) => {
              return (
                <>
                  <div className="flex flex-col bg-[#3C3D37] p-2 rounded gap-2 justify-around">
                    <div>
                      <p>
                        Meeting ID:{" "}
                        <span className="font-bold">{meet.roomId}</span>
                      </p>
                    </div>
                    <div>
                      Meeting Date and Time:
                      <p>{new Date(meet.expiryDate).toUTCString()}</p>
                    </div>
                    <button
                      className="bg-[#697565]"
                      disabled={load}
                      onClick={() => {
                        deleteSch(meet.roomId);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              );
            })}
        </div>
        {meetAr.length === 0 && (
          <h1 className="text-2xl">No Upcoming Meetings Available</h1>
        )}
        <button className="flex p-2 bg-[#3C3D37] mt-2 mx-auto" onClick={cancel}>
          Cancel
        </button>
      </div>
    </>
  );
}
