import { Particpant } from "../App";
import { Mute, OffCam } from "./starters";
import { Swiper, SwiperSlide } from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Phone, UserAvatar } from "./svgs";
export function VidDivs({
  participants,
  id,
}: {
  participants: Particpant[];
  id: string;
}) {
  if(participants.length == 0){
    return <></>
  }else{
   
    return (
      <>
        <Swiper
        spaceBetween={3}
        slidesPerView={participants.length > 2 ? 2 : 1}
        modules={[Navigation, Pagination]}
        navigation
        pagination
        >
          {participants.map((participant, i) => {
            if (participant.userId === id) {
              return <></>;
            } else {
              let clName = participant.offed ? "size-32" : "size-32 hidden";
              return (
                <>
                  <SwiperSlide
                  className="w-full p-4"
                  >
                    <div
                      id={participant.userId.substring(
                        0,
                        participant.userId.indexOf("-")
                      )}
                      className="flex flex-col gap-1 items-center"
                    >
                      <p className="self-end">{participant.uname}</p>
                      <UserAvatar className={clName} id={participant.userId.split("-")[participant.userId.length - 1]} />
                      <div className="flex gap-1 items-center">
                        <Mute muted={participant.muted} cursor={false} />
                        <OffCam offed={participant.offed} cursor={false} />
                      </div>
                    </div>
                  </SwiperSlide>
                </>
              );
            }
          })}
        </Swiper>
      </>
    );
  }
}

export function EndCall({end}:{end:React.MouseEventHandler<HTMLDivElement>}){
  return (
    <>
      <div className="rounded-full p-2 cursor-pointer bg-[#800000]" onClick={end}>
        <Phone className="size-6" />
      </div>
    </>
  )
}