export default function ChatView(){
    return (
        <>
        <div className="bg-[#3C3D37] max-h-[25rem] overflow-auto">
          <div id="chats">

          </div>
          <div>
            <div>
              <input placeholder="Type in a message" />
            </div>
          </div>
        </div>
        </>
    )
}