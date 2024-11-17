import { Post as PostType } from "./types";
import { useEffect, useRef, useState } from "react";
import { FaLeaf } from 'react-icons/fa'
import { IoLibrary } from 'react-icons/io5'

export default function Post({ data } : { data: PostType }) {

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [inView, setInView] = useState(false);
  const [time, setTime] = useState(0);

  const observer = useRef<IntersectionObserver>();
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        console.log("in view" + data.index);
        setInView(true);
        startTime.current = performance.now();
        console.log(startTime.current);
      } else {
        console.log("out of view" + data.index);
        setInView(false);
        if (startTime.current) {
          console.log("moved out of view" + data.index);
          setTime(time => time + performance.now() - startTime.current!);
          startTime.current = null;
          console.log("Time spent: " + time);
          console.log("Liked: " + liked);
          console.log("Saved: " + saved);
          // post request 
          fetch('/api/python', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
              time: time,
              liked: liked,
              saved: saved,
              dummy: "hello i am dumb"
            })
          }).then(res => res.json()).then(data => {
            console.log(data);
          }).catch(err => {
            console.error(err);
          });
        } 
      }
    }, { threshold: 1 });

    observer.current.observe(document.getElementById(`post-${data.index}`)!);
  }, [time, liked, saved]);

  return (
    <div id={`post-${data.index}`}className="min-h-screen w-[40vw] p-4 border border-gray-200 rounded-lg scroller-element">
      <p className="text-2xl font-bold">{data.title}</p>
      <p className="text-lg">{data.content}</p>
      <p className="text-sm text-gray-500">Author: {data.author}</p>
      <p className="text-sm text-gray-500">Keywords: {data.keywords.join(", ")}</p>
      <p className="text-sm text-gray-500">Created At: {data.createdAt.toDateString()}</p>

      <button 
        className="bg-green-500 text-white p-2 rounded-lg mt-2 hover:bg-green-300"
        onClick={() => setLiked(!liked)}
      >
        <FaLeaf />
      </button>
      <button 
        className="bg-blue-500 text-white p-2 rounded-lg mt-2 hover:bg-blue-300"
        onClick={() => setSaved(!saved)}
      >
        <IoLibrary />
      </button>
    </div>
  )

}