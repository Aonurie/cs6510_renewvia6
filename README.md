# P6 Renewvia-Design

## Overview
The Renewvia Energy project aims to develop an electricity‐grid design optimizer using an optimization algorithm. Our project helps optimize pole and cable placement (and overall cost) to deliver energy in a region in Kenya. 
Deliverables include:
- A graph‐based optimization algorithm  
- A research paper documenting our approach  
- An interactive website for exploring project info and running the optimizer  

## Features
- **Project Dashboard**  
  - Timeline  
  - Team members & roles  
  - User Documentation
  - User Story
  - Goals & updates  
  - Presentation slides & demo  
  - Final presentation video  
  - Lighthouse performance scores  
- **Grid Optimizer**  
  - Upload a CSV of candidate pole sites & demand points  
  - Run the algorithm in‐browser 
  - Download/export the resulting optimized grid layout  

## Built With
- **Frontend:** Next.js – React framework for server‑side rendering and static site generation
- **Backend:** Python (Render Used to Run Backend)
- **Machine Learning & Graph Algorithms:** scikit‑learn, NetworkX, scipy 
- **Other:** pandas, NumPy, flask,matplotlib, gunicorn, openpyxl, flask-cors

## Getting Started

### Prerequisites
- Node.js v14+ and npm
- Python 3.8+ 

### Installation

1. **Clone this repository**  
   ```bash
   git clone https://github.com/Aonurie/cs6510_renewvia6.git
   cd cs6510_renewvia6
Run Locally

npn run dev 

or 

npm run build
npm start


### Folder Explainations
- **project:** Holds code for project tab and UI for inputing csv 
- **backend:** Holds backend code and algorithm
- **components:** Holds text and information that holds the wepage content
- **files** Holds test data and presentation videos for project 