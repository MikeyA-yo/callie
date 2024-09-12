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

export function SchedulePop(){
  return (
    <>
     <div className="fixed top-1/2 z-20 bg-[#697565] transform -translate-x-1/2 -translate-y-1/2 left-1/2">
        <div className="flex flex-col p-4 gap-2">
           <h3 className="text-xl">Schedule a new meeting</h3>
           <div className="flex flex-col gap-2">
            <p>Enter Desired ID:</p>
            <input className="p-2 text-[#697565]" placeholder="unqiue room ID of your choice" />
            <p>Input Date</p>
            <input className="p-2 text-[#697565]" type="date" />
           </div>
        </div>
     </div>
    </>
  )
}