"use client";

import { allPosts } from "@/.contentlayer/generated"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Home() {
  const [showMessage, setShowMessage] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Get current date in EST
      const now = new Date();
      const estOffset = -4; // EDT offset
      const currentEST = new Date(now.getTime() + (estOffset * 60 * 60 * 1000));
      
      // Set target to 11:59 PM EST today
      const target = new Date(currentEST);
      target.setHours(23, 59, 0, 0);
      
      // If current time is past 11:59 PM, set target to next day
      if (currentEST > target) {
        target.setDate(target.getDate() + 1);
      }

      const difference = target.getTime() - currentEST.getTime();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft("Survey is now available!");
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Cleanup on unmount
    return () => clearInterval(timer);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 5000);
  };

  return (
    <div className="prose dark:prose-invert">
      {/* Availability Link */}
      <div className="mb-8">
        <a 
          href="#" 
          onClick={handleClick}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Peer Review Survey
        </a>
        {showMessage && (
          <div className="mt-2 p-4 bg-blue-100 text-blue-700 rounded-md">
            {timeLeft}
          </div>
        )}
      </div>

      {/* Static Content */}
      <section>
        <h1 className="mt-4">P6 Renewvia-Design</h1>
        <p>
        The Renewvia Energy project aims to develop an electricity grid design optimizer using machine learning. The goal is to optimize pole and cable placement and cost to provide reliable electricity for areas in Kenya.

        Our deliverables include an approach to solving the graph problem and comprehensive project documentation in the form of a research paper.
        </p>
      </section>

      {/* Dynamic List of Posts */}
      <section>
        {allPosts.map((post) => (
          <article key={post._id}>
            <Link href={post.slug}>
              <h2>{post.title}</h2>
            </Link>
            {post.description && <p>{post.description}</p>}
          </article>
        ))}
      </section>
    </div>
  )
}