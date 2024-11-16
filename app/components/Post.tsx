
export default function Post({ n, text } : { n : number, text: string }) {
  return (
    <div id={`post-${n}`}className="min-h-screen w-[40vw] p-4 border border-gray-200 rounded-lg scroller-element">
      <p className="text-lg">{text}</p>
    </div>
  )

}