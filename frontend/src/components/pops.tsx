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