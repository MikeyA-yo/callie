export default function ChatView({
  send,
}: {
  send?: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <>
      <div className="bg-[#3C3D37] p-4 flex flex-col w-full gap-2">
        <div
          id="chats"
          className="min-h-52 max-h-[25rem] bg-[#697565]  overflow-auto"
        ></div>
        <div className="mx-auto">
          <div className="bg-[#3C3D37] flex items-center gap-2 w-full">
            <input
              className="p-2 text-[#697565] bg-[#3C3D37] rounded border border-[#ECDFCC] outline-none"
              placeholder="Type in a message here"
            />
            <div onClick={send}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="fill-[#ECDFCC] size-6"
              >
                <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376v103.3c0 18.1 14.6 32.7 32.7 32.7 9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1-123.1-51.3zm335.1 139.7l-166.6-69.5 214.1-239.3-47.5 308.8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ChatFrom(){
  return (
    <>
      <div className="bg-[#3C3D37] p-2 rounded">
         
      </div>
    </>
  )
}
