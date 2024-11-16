import Image from 'next/image'
import Link from 'next/link'
import Post from './components/Post'
import Main from './components/Main'

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between scroller">
      <Main />
    </main>
  )
}
