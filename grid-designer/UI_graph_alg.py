import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from scipy.spatial import distance_matrix
import networkx as nx
from scipy.spatial import KDTree
from sklearn.neighbors import BallTree

# calculates Haversine dist between two points on Earth (in meters)
def haversine(lat1, lon1, lat2, lon2):
    R = 6371000  # Earth's radius in meters
    dlat = np.radians(lat2 - lat1)
    dlon = np.radians(lon2 - lon1)
    a = np.sin(dlat/2)**2 + np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) * np.sin(dlon/2)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    return R * c  # Distance in meters

# Function to find the halfway point between two locations
def halfway_point(lat1, lon1, lat2, lon2, fraction):
    lat = lat1 + (lat2 - lat1) * fraction
    lon = lon1 + (lon2 - lon1) * fraction
    return lat, lon

# Kruskal's algorithm to find the Minimum Spanning Tree (MST)
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

def load_data(excel_path):
    df = pd.read_excel(excel_path)
    return df

def determine_num_poles(num_buildings):
    return max(5, min(int(np.sqrt(num_buildings) * 1.5), 100))

def kmeans_pole_placement(buildings, num_poles):
    kmeans = KMeans(n_clusters=num_poles, n_init=10)
    kmeans.fit(buildings)
    return kmeans.cluster_centers_

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
                halfway_lat, halfway_lon = halfway_point(closest_building[0], closest_building[1], pole[0], pole[1], 0.5)
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


def main(excel_path):
    # Read in user-given coordinate data
    df = load_data(excel_path)
    buildings = df[df['Name'] != 'Power Source'][['Latitude', 'Longitude']].values
    power_source = df[df['Name'] == 'Power Source'][['Latitude', 'Longitude']].values[0]
    
    # Determine num of clusters/candidate pole locations to start with
    num_poles = determine_num_poles(len(buildings))
    
    # Use kmeans to determine candidate pole locations
    candidate_poles = kmeans_pole_placement(buildings, num_poles)
    
    # Update pole list to make sure every building has a pole 3-20m away
    updated_poles = ensure_pole_connections(buildings, candidate_poles)
    
    # remove poles that are in same spots as buildings
    updated_poles = [pole for pole in updated_poles if pole not in buildings]

    # Enforce grid design constraints (no cables > 50m, etc.) & create MST
    G, final_poles = enforce_graph_constraints(updated_poles, power_source)
    
    # Add in drop-cables aka connect buildings to nearest poles
    G = connect_buildings_to_poles(buildings, final_poles, G)
    
    # prints out edges and their weights aka distances - use this to help calc cost
    for u, v, data in G.edges(data=True):
        print(f"Edge ({u} - {v}) | Weight: {data['weight']:.2f} meters")
    
    visualize(buildings, final_poles, G, power_source)
    
    return final_poles, G

# Example usage:
filtered_poles, graph = main("buildingcoordinate1.xlsx")

#### TO-DO ####
# Connect to UI so excel is given by user & resulting graph is shown on website
# Could add in 'pruning' feature to get rid of isolated poles
    # (poles not connecting to buildings or needed to connect to power source)
# Could check distances between poles and add in intermediate nodes when distance
    # is over 50 meters
# Add in cost analysis (so just take in user-given hyperparamters of what cables,
    # poles, etc. costs and then determine from final graph what the cost will be)
# Final output to user should be a visualization the grid design + total cost of
    # it given their inputted excel with gps coordinates and cost hyperparameters
    
### INPUTS FROM USER ###
# excel with coordinates - specify format to user (what cols are needed)
# 3 cost hyperparameters
    # pole cost
    # LV cable cost
    # MV cable cost