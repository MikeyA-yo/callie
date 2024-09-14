import { useState, useEffect } from "react"
import { AddMeeting, GetMeetings, Schedule, Schedule2 } from "../../wailsjs/go/main/App"
import { Spinner, Tick, XMark } from "./svgs";

export function ChatPopUp({message, from}:{from:string, message:string}){
  return (
    <>
     <div className="top-2/3 p-4 right-1/2 fixed z-10 rounded bg-[#3C3D37] flex flex-col gap-2">
       <p className="self-end text-sm">{from}</p>
       <p className="text-md">{message}</p>
     </div>
    </>
  )
}

export function SelfCam({children}:{children:React.ReactNode}){
    return (
        <>
          <div className="top-4 right-4 fixed z-10">
            {children}
          </div>
        </>
    )
}

export function SchedulePop({cancel, uname}:{cancel?:React.MouseEventHandler<HTMLButtonElement>, uname:string}){
  const [data, setData] = useState({id:"",exp:0});
  const [load, setLoad] = useState(false);
  const [a, b] = useState(false);
  const [c, d] = useState(false);
  const [e, f] = useState("")
  // const [g, h] = useState<Array<any>>([])
  useEffect(()=>{
      (async function(){
          let meetings = await GetMeetings();
          f(meetings)
      }())
  },[])
  async function schedule(data:{id:string, exp:number}){
    setLoad(true)
    let val = await Schedule(data.exp, uname, data.id);
    setLoad(false)
    if (val === false){
      d(true)
    }else{
      if(e.includes("meetings")){
        let meetingArray = JSON.parse(e).meetings;
        meetingArray.push({roomId:data.id, expiryDate:data.exp})
        let meetObj = {
          meetings: meetingArray
        }
        AddMeeting(JSON.stringify(meetObj))
      }else{
         AddMeeting(JSON.stringify({meetings: [{roomId:data.id, expiryDate:data.exp}]}))
      }
     // AddMeeting(JSON.stringify(g.push({roomId:data.id, expiryDate:data.exp})))
    }
    b(val)
  }
  function handleInput(e:React.ChangeEvent<HTMLInputElement>){
     setData(prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
     })
  }
  return (
    <>
     <div className="fixed top-1/2 z-20 bg-[#697565] transform -translate-x-1/2 -translate-y-1/2 left-1/2">
        <div className="flex flex-col p-4 gap-2">
          {a && <Success />}
          {c && !a && <E />}
           <h3 className="text-xl">Schedule a new meeting</h3>
           <div className="flex flex-col gap-2">
            <p>Enter Desired ID:</p>
            <input className="p-2 text-[#697565]" name="id" onChange={handleInput} placeholder="Room ID of your choice" />
            <p>Input Date and Time</p>
            <input className="p-2 text-[#697565]" onChange={e => {
              setData(prev =>{
                return {
                  ...prev,
                  exp:new Date(e.target.value).getTime()
                }
              })
            }} type="datetime-local" min={new Date().toISOString()} />
            <button onClick={()=>{
              schedule(data)
            }} className="flex gap-2 justify-between p-2 bg-[#3C3D37]">Schedule {load && <Spinner className="animate-spin size-6" />}</button>
            <button onClick={cancel} className="flex p-2 bg-[#3C3D37]">Cancel</button>
           </div>
        </div>
     </div>
    </>
  )
}

function Success(){
  return (
    <>
     <div className="bg-green-500 flex gap-2 items-center justify-around p-3">
       Schedule Created <Tick className="size-6 border-[#697565] rounded border p-1"/>
     </div>
    </>
  )
}
function E(){
  return (
    <>
   <div className="bg-red-500 flex gap-2 items-center justify-around p-3">
       Schedule failed to create, this ID already exists or network issues <XMark className="size-6 border-[#697565] rounded border p-1"/>
     </div> </>
  )
}

export function UpcomingPop(){
  const [meetings, setMeetings] = useState("");
  useEffect(()=>{

  },[])

}