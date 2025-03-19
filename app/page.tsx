"use client";

import { allPosts } from "@/.contentlayer/generated"
import Link from "next/link"
import { useState } from "react"

export default function Home() {
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 10000);
  };

  return (
    <div className="prose dark:prose-invert">
      {/* Availability Link */}
      <div className="mb-8" style={{ marginTop: "1rem" }}>
        <a 
          href="#" 
          onClick={handleClick}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Peer Review Survey
        </a>
        {showMessage && (
          <div className="mt-2 p-4 bg-blue-100 text-blue-700 rounded-md">
            Survey is not yet available. Please check back in 12 hours.
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