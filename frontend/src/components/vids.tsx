import { Particpant } from "../App";
import { Mute, OffCam } from "./starters";

export function VidDivs({participants, id, }:{participants:Particpant[], id:string}){
  return (
    <>
      {participants.map((particpant, i) =>{
     if(particpant.userId === id){
        return <></>
     }else{
        return (
            <>
            <div id={particpant.userId.substring(0, particpant.userId.indexOf("-"))}>
                <div className="flex gap-1 items-center">
                    <Mute muted={particpant.muted} />
                    <OffCam offed={particpant.offed} />
                </div>
            </div>
            </>
        )
     }
  })}
    </>
  )
}