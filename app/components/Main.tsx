"use client"

import { use, useEffect, useRef, useState } from "react";
import Post from "./Post";
import { Post as PostType } from "./types";
import { randomUUID } from "crypto";

export default function Main() {
    const dummyPost1: PostType = {
        index: 0,
        id: "3ij21md1",
        title: "Lorem Ipsum",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget libero.",
        author: "shark",
        keywords: ["shark", "shark", "shark"],
        createdAt: new Date()
    }

    const dummyPost2: PostType = {
        index: 1,
        id: "2m3iic01",
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
    const observedElements = useRef<Set<Element>>(new Set<Element>());
    const time = useRef<number>(performance.now());

    const [currentLiked, setCurrentLiked] = useState(false);
    const [currentSaved, setCurrentSaved] = useState(false);

    const handleLike = () => {
        setCurrentLiked(!currentLiked);
    }

    const handleSave = () => {
        setCurrentSaved(!currentSaved);
    }

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
            //console.log(data);
            const newPosts = [{ 
                index: posts.length,
                id: '1' + Math.floor(Math.random() * 1000000).toString().padStart(7, '0'),
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

    const handleScroll = (id: number) => {
        if (id === 0) return;
        const newTime = performance.now();
        const totalTime = newTime - time.current;
        time.current = newTime;
        fetch('/api/python', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id - 1,
                time: totalTime
            })
        }).then(res => res.json()).then(data => {
            console.log(data);
        });
        
    }

    useEffect(() => {
        const options = {
            root: document.querySelector('#main-container'),
            rootMargin: '0px',
            threshold: 0.83
        };

        const sentinelObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && hasMore) {
                    fetchMorePosts();
                }
            })
        }, options);

        const postsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !observedElements.current.has(entry.target)) {
                    observer.unobserve(entry.target);
                    console.log(entry.target.id)
                    observedElements.current.add(entry.target);
                    handleScroll(parseInt(entry.target.id.split('-')[1]));
                }
            })
        }, { threshold: 1 });

        document.querySelectorAll('.scroller-element').forEach(element => {
            postsObserver.observe(element);
        });

        if (sentinelRef.current) {
            sentinelObserver.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) {
                sentinelObserver.unobserve(sentinelRef.current);
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