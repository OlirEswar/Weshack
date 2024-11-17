"use client"

import { use, useEffect, useRef, useState } from "react";
import Post from "./Post";
import { Post as PostType } from "./types";

export default function Main() {
    const dummyPost1: PostType = {
        id: 0,
        title: "Lorem Ipsum",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget libero.",
        author: "shark",
        keywords: ["shark", "shark", "shark"],
        createdAt: new Date()
    }

    const dummyPost2: PostType = {
        id: 1,
        title: "Lorem Ipsum",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget libero.",
        author: "shark",
        keywords: ["shark", "shark", "shark"],
        createdAt: new Date()
    }

    const sentinelRef = useRef<HTMLDivElement>(null);
    const [posts, setPosts] = useState([
        dummyPost1, dummyPost2
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
            const newPosts = [{ 
                id: posts.length,
                title: "Lorem Ipsum" + posts.length,
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget libero." + data[0],
                author: "shark",
                keywords: ["shark", "shark", "shark"],
                createdAt: new Date()
            }]

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
            {posts.map(post => <Post key={post.id} data={post} />)}
            <div ref={sentinelRef} id="sentinel" />
        </main>
    )
}