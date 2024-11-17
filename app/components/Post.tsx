import { Post as PostType } from "./types";
import { useState } from "react";
import { FaLeaf } from 'react-icons/fa'
import { IoLibrary } from 'react-icons/io5'

export default function Post({ data } : { data: PostType }) {

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

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