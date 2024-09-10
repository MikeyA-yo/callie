export default function Starters({
  schedule,
  join,
  close,
  text,
  media,
  jState
}: {
  schedule: React.MouseEventHandler<HTMLDivElement>;
  join: React.MouseEventHandler<HTMLDivElement>;
  close: React.MouseEventHandler<HTMLDivElement>;
  text: string;
  media: React.MouseEventHandler<HTMLDivElement>;
  jState:boolean
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
          {!jState && <JoinSvg />}
          {!jState && "Join a Meeting"}
          {jState && <ExitSvg className="size-12 fill-[#ECDFCC]" />}
          {jState && "Exit Meeting"}
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
  muted,
}: {
  mute?: React.MouseEventHandler<SVGSVGElement>;
  muted: boolean;
}) {
  let clString = muted
    ? "cursor-pointer"
    : "rounded-full p-2 bg-[#ECDFCC] text-[#697565] cursor-pointer";
  return (
    <>
      <div className={clString}>
        {!muted && <MicSvg onClick={mute} />}
        {muted && <MicSlashSvg onClick={mute} className="size-6 fill-[#ECDFCC]" />}
      </div>
    </>
  );
}
export function OffCam({
  off,
  offed,
}: {
  off?: React.MouseEventHandler<SVGSVGElement>;
  offed: boolean;
}) {
  let clString = offed
    ? "cursor-pointer"
    : "rounded-full p-2 bg-[#ECDFCC] text-[#697565] cursor-pointer";
  return (
    <div className={clString}>
      {!offed && <VideoSvg className="size-6" onClick={off} />}
      {offed && <VideoSlashSvg onClick={off} />}
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

function VideoSlashSvg(props: React.SVGProps<SVGSVGElement>) {
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
        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"
      />
    </svg>
  );
}
function ExitSvg(props: React.SVGProps<SVGSVGElement>){
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M377.9 105.9l122.8 122.8c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9-18.7 0-33.9-15.2-33.9-33.9V320H192c-17.7 0-32-14.3-32-32v-64c0-17.7 14.3-32 32-32h128v-62.1c0-18.7 15.2-33.9 33.9-33.9 9 0 17.6 3.6 24 9.9zM160 96H96c-17.7 0-32 14.3-32 32v256c0 17.7 14.3 32 32 32h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-53 0-96-43-96-96V128c0-53 43-96 96-96h64c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
    </svg>
  )
}

function MicSlashSvg(props: React.SVGProps<SVGSVGElement>){
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" {...props}>
      <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2s-6.3 25.5 4.1 33.7l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7v-40c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 21.2-5.1 41.1-14.2 58.7L416 300.8V96c0-53-43-96-96-96s-96 43-96 96v54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9c-12.1 3.7-24.9 5.7-38.2 5.7-70.7 0-128-57.3-128-128v-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6v40c0 89.1 66.2 162.7 152 174.4V464h-48c-13.3 0-24 10.7-24 24s10.7 24 24 24h144c13.3 0 24-10.7 24-24s-10.7-24-24-24h-48v-33.6z" />
    </svg>
  )
}