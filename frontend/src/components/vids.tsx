import { Particpant } from "../App";
import { Mute, OffCam } from "./starters";
import { Swiper, SwiperSlide } from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Phone } from "./svgs";
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
          {participants.map((particpant, i) => {
            if (particpant.userId === id) {
              return <></>;
            } else {
              return (
                <>
                  <SwiperSlide
                  className="w-full p-4"
                  >
                    <div
                      id={particpant.userId.substring(
                        0,
                        particpant.userId.indexOf("-")
                      )}
                      className="flex flex-col gap-1 items-center"
                    >
                      <p className="self-end">{particpant.uname}</p>
                      <div className="flex gap-1 items-center">
                        <Mute muted={particpant.muted} cursor={false} />
                        <OffCam offed={particpant.offed} cursor={false} />
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