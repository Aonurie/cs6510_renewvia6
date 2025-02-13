import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { allPosts } from "@/.contentlayer/generated"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground shadow-md">
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">CS6510 Renewvia</h1>
          <div className="space-x-4">
            <Link href="#description">
              <Button variant="ghost">Description</Button>
            </Link>
            <Link href="#team">
              <Button variant="ghost">Team</Button>
            </Link>
            <Link href="#goal">
              <Button variant="ghost">Goal</Button>
            </Link>
            <Link href="#paper">
              <Button variant="ghost">Paper</Button>
            </Link>
            <Link href="#blog">
              <Button variant="ghost">Blog</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section id="description" className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The CS6510 Renewvia project aims to develop an automated approach to electricity grid design. We are
                working in partnership with Renewvia, represented by Nicholas Selby. The project involves solving a
                complex graph problem to optimize electricity grid layouts.
              </p>
              <p>
                Our deliverables include an approach to solving the graph problem and comprehensive project
                documentation, likely in the form of a research or conference paper.
              </p>
            </CardContent>
          </Card>
        </section>

        <section id="team" className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Team Members and Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Taylor Boyd:</strong> Focusing on initial parameterization and pole count/location
                  determination. Responsible for the Abstract and Introduction of the research paper.
                </li>
                <li>
                  <strong>Enming Li:</strong> Researching methods to input geographical data into machine learning
                  models. Will write the Conclusion section of the research paper.
                </li>
                <li>
                  <strong>Taylor Nguyen:</strong> Developing models for optimal grid routes based on constraints.
                  Contributing to the Methods section of the research paper.
                </li>
                <li>
                  <strong>Dharshan Rammohan:</strong> Implementing graph-based ML methods for grid design. Managing the
                  Overleaf project and contributing to the Methods section of the research paper.
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section id="goal" className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Overall Project Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our primary goal is to develop a meaningful solution for automating electricity grid design. This
                involves creating a machine learning model that can efficiently design electricity grids subject to
                various constraints. The project aims to optimize pole count, locations, and connectivity while
                considering factors such as cable lengths, costs, and voltage drop.
              </p>
            </CardContent>
          </Card>
        </section>

        <section id="paper" className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Research Paper</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4
