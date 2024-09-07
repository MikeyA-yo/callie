export default function ChatView({
  chats,
  send,
  input,
  me,
  enterSend,
  senders,
}: {
  send: React.MouseEventHandler<HTMLDivElement>;
  chats: string[];
  input: React.ChangeEventHandler<HTMLInputElement>;
  me: boolean[];
  enterSend: React.KeyboardEventHandler<HTMLInputElement>;
  senders: string[];
}) {
  return (
    <>
      <div className="bg-[#3C3D37] p-4 flex flex-col w-full gap-2">
        <div
          id="chats"
          className="min-h-52 max-h-[25rem] p-3 flex flex-col gap-3 bg-[#697565]  overflow-auto"
        >
          {chats.map((chat, i) => (
            <Chat message={chat} me={me[i]} sender={senders[i]} />
          ))}
        </div>
        <div className="mx-auto">
          <div className="bg-[#3C3D37] flex items-center gap-2 w-full">
            <input
              onChange={input}
              onKeyDown={enterSend}
              id="chat-input"
              className="p-2 text-[#ECDFCC] bg-[#3C3D37] rounded border border-[#ECDFCC] outline-none"
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

export function Chat({
  message,
  me,
  sender,
}: {
  message: string;
  me: boolean;
  sender?: string;
}) {
  return (
    <>
      <div
        className={`bg-[#3C3D37] flex flex-col gap-1 p-2 max-w-[50%] min-w-[25%] rounded ${
          me && "self-end"
        }`}
      >
        <p className="text-xs self-end">{sender}</p>
        <p className="text-base self-start">{message}</p>
      </div>
    </>
  );
}

export function ChatIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
      />
    </svg>
  );
}
