export default function Starters({
  schedule,
  join,
  close,
  text,
  media,
}: {
  schedule: React.MouseEventHandler<HTMLDivElement>;
  join: React.MouseEventHandler<HTMLDivElement>;
  close: React.MouseEventHandler<HTMLDivElement>;
  text: string;
  media: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <>
      <div className="flex w-full justify-evenly">
        <div
          className="flex flex-col gap-2 items-center cursor-pointer"
          onClick={schedule}
        >
          <CalenderSvg className="size-12 fill-[#ECDFCC]" />
          Schedule a meeting
        </div>
        <div
          className="flex flex-col gap-2 items-center cursor-pointer"
          onClick={join}
        >
          <JoinSvg />
          Join a Meeting
        </div>
        <div
          className={`flex flex-col gap-2 items-center cursor-pointer p-2 rounded ${
            text === "Close Camera" ? "bg-[#697565]" : ""
          }`}
          onClick={close}
        >
          <VideoSvg className={`size-12`} />
          {text}
        </div>
        <div
          className="flex flex-col gap-2 items-center cursor-pointer"
          onClick={media}
        >
          <MediaSvg />
          Toggle Media
        </div>
      </div>
    </>
  );
}
export function Mute({
  mute,
  muted
}: {
  mute?: React.MouseEventHandler<SVGSVGElement>;
  muted:boolean
}) {
  let clString = muted ? "cursor-pointer" : "rounded-full p-2 bg-[#ECDFCC] text-[#697565] cursor-pointer"
  return (
    <>
      <div className={clString}>
        <MicSvg onClick={mute} />
      </div>
    </>
  );
}
export function OffCam({
  off,
  offed
}: {
  off?: React.MouseEventHandler<SVGSVGElement>;
  offed:boolean
}) {
  let clString = offed ? "cursor-pointer" : "rounded-full p-2 bg-[#ECDFCC] text-[#697565] cursor-pointer"
  return (
    <div className={clString}>
      <VideoSvg className="size-6" onClick={off} />
    </div>
  );
}
export function VideoSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  );
}

export function MicSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
      />
    </svg>
  );
}

function CalenderSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}>
      <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24v40H64C28.7 64 0 92.7 0 128v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64h-40V24c0-13.3-10.7-24-24-24s-24 10.7-24 24v40H152V24zM48 192h80v56H48v-56zm0 104h80v64H48v-64zm128 0h96v64h-96v-64zm144 0h80v64h-80v-64zm80-48h-80v-56h80v56zm0 160v40c0 8.8-7.2 16-16 16h-64v-56h80zm-128 0v56h-96v-56h96zm-144 0v56H64c-8.8 0-16-7.2-16-16v-40h80zm144-160h-96v-56h96v56z" />
    </svg>
  );
}
function JoinSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-12"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}
function MediaSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-12"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
}
