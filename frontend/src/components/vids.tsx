import { Particpant } from "../App";
import { Mute, OffCam } from "./starters";
import { Swiper, SwiperSlide } from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
export function VidDivs({
  participants,
  id,
}: {
  participants: Particpant[];
  id: string;
}) {
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
                      <Mute muted={particpant.muted} />
                      <OffCam offed={particpant.offed} />
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
