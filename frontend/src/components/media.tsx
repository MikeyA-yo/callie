export default function MediaView({
  image,
  mp4,
  audio,
  file,
  open,
  save,
}: {
  image: boolean;
  mp4: boolean;
  audio: boolean;
  file: string;
  open: React.MouseEventHandler<HTMLButtonElement>;
  save: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <>
      {image && file && (
        <img
          src={encodeURIComponent(file)}
          alt="image of what you put"
          className="h-44 w-44"
        />
      )}
      {mp4 && file && (
        <video
          src={encodeURIComponent(file)}
          controls
          className="h-96 w-96"
        ></video>
      )}
      {audio && file && (
        <audio
          src={encodeURIComponent(file)}
          controls
          className="max-h-96 max-w-96"
        ></audio>
      )}
      <button onClick={open}>Open File</button>
      <button onClick={save}> Save content</button>
    </>
  );
}
