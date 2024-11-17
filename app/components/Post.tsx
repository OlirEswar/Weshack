import { Post as PostType } from "./types";

export default function Post({ data } : { data: PostType }) {
  return (
    <div id={`post-${data.id}`}className="min-h-screen w-[40vw] p-4 border border-gray-200 rounded-lg scroller-element">
      <p className="text-2xl font-bold">{data.title}</p>
      <p className="text-lg">{data.content}</p>
      <p className="text-sm text-gray-500">Author: {data.author}</p>
      <p className="text-sm text-gray-500">Keywords: {data.keywords.join(", ")}</p>
      <p className="text-sm text-gray-500">Created At: {data.createdAt.toDateString()}</p>
    </div>
  )

}