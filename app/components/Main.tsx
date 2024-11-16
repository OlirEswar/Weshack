"use client"

import { use, useEffect, useRef, useState } from "react";
import Post from "./Post";

export default function Main() {
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [posts, setPosts] = useState([
        { id: 0, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget libero." },
        { id: 1, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget libero." }
    ]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchMorePosts = () => {
        if (loading) return;
        setLoading(true);
        // server request
        // setTimeout(() => {
        //     const newPosts = [
        //         { id: posts.length, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget libero." },
        //         { id: posts.length + 1, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget libero." }
        //     ];
        //     setPosts(prevPosts => [...prevPosts, ...newPosts]);
        //     setLoading(false);
        //     setHasMore(newPosts.length > 0);
        // }, 500)
        fetch('/api/python').then(res => res.json()).then(data => {
            console.log(data);
            const newPosts = [
                { id: posts.length, text: data },
            ]

            setPosts(prevPosts => [...prevPosts, ...newPosts]);
            setLoading(false);
            //setHasMore(data.length > 0);
        });
    }

    useEffect(() => {
        const options = {
            root: document.querySelector('#main-container'),
            rootMargin: '0px',
            threshold: 0.83
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && hasMore) {
                    fetchMorePosts();
                }
            })
        }, options);

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
            }
        };

    }, [hasMore, posts]);

    return (
        <main id="main-container" className="flex min-h-screen flex-col items-center justify-between scroller">
            {posts.map(post => <Post key={post.id} n={post.id} text={post.text} />)}
            <div ref={sentinelRef} id="sentinel" />
        </main>
    )
}