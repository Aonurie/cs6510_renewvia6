import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from scipy.spatial import distance_matrix
import networkx as nx
from scipy.spatial import KDTree
from sklearn.neighbors import BallTree

import sys
import json
import io
import base64

# calculates Haversine dist between two points on Earth (in meters)
def haversine(lat1, lon1, lat2, lon2):
    R = 6371000  # Earth's radius in meters
    dlat = np.radians(lat2 - lat1)
    dlon = np.radians(lon2 - lon1)
    a = np.sin(dlat/2)**2 + np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) * np.sin(dlon/2)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    return R * c  # Distance in meters


def enforce_graph_constraints(poles, power_source, max_pole_dist=50):
    G = nx.Graph()

    # Include power source in the pole list
    poles = np.vstack([power_source, poles])

    # Convert lat/lon to radians for BallTree
    poles_rad = np.radians(poles)
    tree = BallTree(poles_rad, metric='haversine')

    # Add nodes to the graph
    for i, pole in enumerate(poles):
        G.add_node(i, pos=tuple(pole))

    edges = []

    # Find nearest neighbors with Haversine metric
    distances, indices = tree.query(poles_rad, k=len(poles))  # Find up to 5 nearest neighbors

    for i in range(len(poles)):
        for j, dist in zip(indices[i][1:], distances[i][1:]):  # Skip self-index at [0]
            dist_meters = dist * 6371000  # Convert from radians to meters
            edges.append((i, j, dist_meters))

    # Use Kruskal's algorithm to find the MST without adding intermediate poles
    edges.sort(key=lambda x: x[2])  # Sort edges by distance (weight)

    uf = UnionFind(len(poles))
    mst_edges = []

    for u, v, weight in edges:
        if uf.union(u, v):
            mst_edges.append((u, v, weight))  # Add this edge to the MST

    # Create the MST graph from the selected edges
    mst_graph = nx.Graph()
    mst_graph.add_weighted_edges_from(mst_edges)

    # To track edges that need intermediate poles
    edges_to_split = [e for e in mst_edges if e[2] > max_pole_dist]

    # Add intermediate poles for edges in the MST that are too long
    for u, v, weight in edges_to_split:
        # Get the actual poles connected by the edge
        pole_u = poles[u]
        pole_v = poles[v]

        # Remove the original edge (u, v) from the MST
        mst_graph.remove_edge(u, v)
        mst_edges.remove((u, v, weight))

        # Compute number of intermediate poles needed
        num_segments = int(np.ceil(weight / max_pole_dist))

        prev_pole = u
        for seg in range(1, num_segments):
            fraction = seg / num_segments
            intermediate_pole = (1 - fraction) * pole_u + fraction * pole_v
            new_pole_index = len(poles)
            poles = np.vstack([poles, intermediate_pole])
            G.add_node(new_pole_index, pos=tuple(intermediate_pole))

            new_dist = haversine(poles[prev_pole][0], poles[prev_pole][1], intermediate_pole[0], intermediate_pole[1])
            mst_edges.append((prev_pole, new_pole_index, new_dist))
            prev_pole = new_pole_index

        # Finally connect the last intermediate pole to the destination pole
        final_dist = haversine(poles[prev_pole][0], poles[prev_pole][1], pole_v[0], pole_v[1])
        mst_edges.append((prev_pole, v, final_dist))

    # Rebuild the MST with the intermediate poles added
    mst_graph = nx.Graph()
    mst_graph.add_weighted_edges_from(mst_edges)

    # Get all nodes that have at least one edge
    used_pole_indices = {n for edge in mst_graph.edges for n in edge}

    # Select only the used poles
    filtered_poles = poles[list(used_pole_indices)]

    return mst_graph, filtered_poles


def connect_buildings_to_poles(buildings, poles, G):
    # Convert poles to radians for BallTree
    poles_rad = np.radians(poles)
    tree = BallTree(poles_rad, metric='haversine')

    # Add buildings to the graph and their positions
    pos = nx.get_node_attributes(G, 'pos')
    for i, building in enumerate(buildings):
        building_rad = np.radians(building)
        dist_rad, index = tree.query([building_rad], k=1)  # Find closest pole
        dist_meters = dist_rad[0][0] * 6371000  # Convert to meters

        building_node = f'B{i}'
        G.add_node(building_node, pos=tuple(building))
        pos[building_node] = tuple(building)
        G.add_edge(index[0][0], building_node, weight=dist_meters)

    # Update the positions of poles
    for i, pole in enumerate(poles):
        pos[i] = tuple(pole)

    nx.set_node_attributes(G, pos, 'pos')
    return G

class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, u):
        if self.parent[u] != u:
            self.parent[u] = self.find(self.parent[u])
        return self.parent[u]

    def union(self, u, v):
        root_u = self.find(u)
        root_v = self.find(v)
        if root_u != root_v:
            # Union by rank
            if self.rank[root_u] > self.rank[root_v]:
                self.parent[root_v] = root_u
            elif self.rank[root_u] < self.rank[root_v]:
                self.parent[root_u] = root_v
            else:
                self.parent[root_v] = root_u
                self.rank[root_u] += 1
            return True
        return False

# cost calc function
def cost_calc(pole_cost, lv_cable_cost, mv_cable_cost, G, buildings, power_source):
    pole_count = 0
    lv_cab_count = 0
    mv_cab_count = 0

    non_pole = tuple(map(tuple, np.vstack([buildings, power_source])))

    for ind, pos in G.nodes(data=True):
        if pos['pos'] not in non_pole:
            pole_count += 1
    for edge in G.edges:
        dist = G.get_edge_data(*edge)["weight"]
        if dist <= 30:
            lv_cab_count += 1
        else:
            mv_cab_count += 1

    total_cost = pole_cost * pole_count + lv_cable_cost * lv_cab_count + mv_cable_cost * mv_cab_count

    return total_cost


# visualize the graph
def visualize(buildings, poles, G, power_source):
    plt.figure(figsize=(10, 10))
    plt.scatter(buildings[:, 1], buildings[:, 0], c='blue', label='Buildings', alpha=0.5)
    plt.scatter(poles[:, 1], poles[:, 0], c='red', label='Poles')
    plt.scatter(power_source[1], power_source[0], c='green', marker='s', label='Power Source', s=100)

    pos = nx.get_node_attributes(G, 'pos')

    # Loop over edges in G and draw them
    for edge in G.edges:
        p1, p2 = pos[edge[0]], pos[edge[1]]
        plt.plot([p1[1], p2[1]], [p1[0], p2[0]], 'k-', alpha=0.5)

    plt.legend()
    plt.xlabel("Longitude")
    plt.ylabel("Latitude")
    plt.title("Energy Grid Pole Placement")
    plt.show()

    # Save plot to bytes buffer instead of showing
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)

    return buf

def halfway_point(lat1, lon1, lat2, lon2, fraction):
    lat = lat1 + (lat2 - lat1) * fraction
    lon = lon1 + (lon2 - lon1) * fraction
    return lat, lon


def ensure_pole_connections(buildings, poles, min_dist=3, max_dist=20):
    drop_poles = []
    for pole in poles:
        # Compute Haversine distances to all buildings
        dists = np.array([haversine(pole[0], pole[1], b[0], b[1]) for b in buildings])

        # Find buildings within the min/max distance range
        close_buildings = buildings[(dists >= min_dist) & (dists <= max_dist)]

        if len(close_buildings) == 0:
            # Find closest building (even if it's outside min/max range)
            closest_building = buildings[np.argmin(dists)]

            # Calculate initial distance between closest building and pole
            initial_distance = haversine(closest_building[0], closest_building[1], pole[0], pole[1])

            # Halve the distance iteratively until it's 20m or less
            distance_to_travel = initial_distance
            while distance_to_travel > 20:
                # Move halfway
                halfway_lat, halfway_lon = halfway_point(closest_building[0], closest_building[1], pole[0], pole[1],
                                                         0.5)
                drop_pole = (halfway_lat, halfway_lon)

                # Recalculate distance to pole
                distance_to_travel = haversine(drop_pole[0], drop_pole[1], pole[0], pole[1])

                # If the distance is 20m or less, stop
                if distance_to_travel <= 20:
                    drop_poles.append(drop_pole)
                    break
                else:
                    # Continue halving the distance
                    closest_building = drop_pole

    return np.vstack([poles, drop_poles]) if drop_poles else poles


def visualize_candidate_poles(buildings, candidate_poles):
    plt.figure(figsize=(10, 10))

    # Plot buildings using blue circles.
    plt.scatter(buildings[:, 1], buildings[:, 0],
                c='blue', label='Buildings', alpha=0.6, edgecolors='k', s=100)

    # Plot candidate poles using red triangles.
    plt.scatter(candidate_poles[:, 1], candidate_poles[:, 0],
                c='red', marker='^', label='Candidate Poles', alpha=0.8, edgecolors='k', s=150)

    plt.xlabel("Longitude")
    plt.ylabel("Latitude")
    plt.title("Buildings and Candidate Poles (ILP)")
    plt.legend()
    plt.grid(True)
    plt.show()

def load_data(file_path):
    # Change to handle CSV instead of Excel
    df = pd.read_csv(file_path)
    return df

def create_candidate_poles(buildings, radius=20, grid_spacing=1):
    buildings = np.array(buildings)
    lats = buildings[:, 0]
    long = buildings[:, 1]
    lat_min, lat_max = lats.min(), lats.max()
    long_min, long_max = long.min(), long.max()

    # Convert radius meters to degrees
    margin = radius / 111111
    lat_min -= margin
    lat_max += margin

    # adjust of the average latitude
    avg_lat = (lat_min + lat_max) / 2
    long_margin = radius / (111111 * math.cos(math.radians(avg_lat)))
    long_min -= long_margin
    long_max += long_margin

    #convert grid from meters to degrees
    lat_spacing = grid_spacing / 111111  # degrees latitude
    long_spacing = grid_spacing / (111111 * math.cos(math.radians(avg_lat)))  # degrees longitude

    # Create the grid of candidate points
    lat_range = np.arange(lat_min, lat_max, lat_spacing)
    long_range = np.arange(long_min, long_max, long_spacing)
    candidate_locations = []
    for lat in lat_range:
        for lon in long_range:
            candidate_locations.append((lat, lon))
    candidate_locations = np.array(candidate_locations)
    n_candidates = len(candidate_locations)

    #find canidate poles
    candidate_covers = {}
    for i, candidate in enumerate(candidate_locations):
        candidate_covers[i] = []
        for j, building in enumerate(buildings):
            if haversine(candidate[0], candidate[1], building[0], building[1]) <= radius:
                candidate_covers[i].append(j)

    # ILP
    prob = LpProblem("Pole_Set_Cover", LpMinimize)
    # 1 if candidate pole i is selected otherwise 0
    x = {i: LpVariable(f"x_{i}", cat=LpBinary) for i in range(n_candidates)}

    #objective to minimize
    prob += lpSum(x[i] for i in range(n_candidates)), "Minimize_Number_of_Poles"

    #each building covered by pole
    n_buildings = len(buildings)
    for j in range(n_buildings):
        covering_candidates = [i for i in range(n_candidates) if j in candidate_covers[i]]
        prob += lpSum(x[i] for i in covering_candidates) >= 1, f"Cover_building_{j}"

    prob.solve(PULP_CBC_CMD(msg=False))

    #get all canidate poles
    selected_indices = [i for i in range(n_candidates) if x[i].varValue == 1]
    candidate_poles = candidate_locations[selected_indices]
    return candidate_poles

def main(file_path, poles_cost, mv_cost, lv_cost):
    # Read in user-given coordinate data
    df = load_data(file_path)

    # Check if Power Source exists
    if not any(df['Name'] == 'Power Source'):
        raise ValueError("CSV file must contain a row with 'Power Source' in the Name column")

    buildings = df[df['Name'] != 'Power Source'][['Latitude', 'Longitude']].values
    power_source = df[df['Name'] == 'Power Source'][['Latitude', 'Longitude']].values[0]

    candidate_poles = create_candidate_poles(buildings, radius=20, grid_spacing=1)
    visualize_candidate_poles(buildings, candidate_poles)

    updated_poles = ensure_pole_connections(buildings, candidate_poles)

    G, final_poles = enforce_graph_constraints(updated_poles, power_source)

    G = connect_buildings_to_poles(buildings, final_poles, G)

    total_cost = cost_calc(poles_cost, lv_cost, mv_cost, G, buildings, power_source)

    buf = visualize(buildings, final_poles, G, power_source)