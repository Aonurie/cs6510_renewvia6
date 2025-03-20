"use client";

import { allPosts } from "@/.contentlayer/generated"
import Link from "next/link"

export default function Home() {
  return (
    <div className="prose dark:prose-invert">
      {/* Availability Link */}
      <div className="mb-8" style={{ marginTop: "1rem" }}>
        <a 
          href="https://forms.office.com/Pages/ResponsePage.aspx?id=u5ghSHuuJUuLem1_MvqggwnJpZvg61RHmL8sFDtiCURUNVlBQzhMSUFJUUozWjZKNlBINko3WThNQi4u" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Peer Review Survey
        </a>
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