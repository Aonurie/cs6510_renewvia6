import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from scipy.spatial import distance_matrix
import networkx as nx
from scipy.spatial import KDTree

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
        dists = np.linalg.norm(buildings - pole, axis=1)
        close_buildings = buildings[(dists >= min_dist) & (dists <= max_dist)]
        if len(close_buildings) == 0:
            closest_building = buildings[np.argmin(dists)]
            drop_pole = (closest_building + pole) / 2
            drop_poles.append(drop_pole)
    return np.vstack([poles, drop_poles]) if drop_poles else poles

def enforce_graph_constraints(poles, power_source, max_pole_dist=50):
    G = nx.Graph()
    
    poles = np.vstack([power_source, poles])
    kdtree = KDTree(poles)
    
    # Add nodes to graph
    for i, pole in enumerate(poles):
        G.add_node(i, pos=tuple(pole))
    
    edges = []
    
    # Add edges based on distance to form the graph
    for i in range(len(poles)):
        distances, indices = kdtree.query(poles[i], k=5)
        for j, dist in zip(indices[1:], distances[1:]):
            if dist <= max_pole_dist:
                edges.append((i, j, dist))  # (node1, node2, weight)
    
    # Now use Kruskal's algorithm to find the MST
    edges.sort(key=lambda x: x[2])  # Sort edges by distance (weight)
    
    uf = UnionFind(len(poles))
    mst_edges = []
    
    for u, v, weight in edges:
        if uf.union(u, v):
            mst_edges.append((u, v, weight))  # Add this edge to the MST
    
    # Create the MST graph from the selected edges
    mst_graph = nx.Graph()
    mst_graph.add_weighted_edges_from(mst_edges)
    
    return mst_graph, poles

def connect_buildings_to_poles(buildings, poles, G):
    kdtree = KDTree(poles)
    
    # Add buildings to the graph and their positions
    pos = nx.get_node_attributes(G, 'pos')  # Get the current node positions
    for i, building in enumerate(buildings):
        dist, index = kdtree.query(building)
        building_node = f'B{i}'
        G.add_node(building_node, pos=tuple(building))
        pos[building_node] = tuple(building)  # Add building position to pos dictionary
        G.add_edge(index, building_node, weight=dist)
    
    # Update the positions of poles
    for i, pole in enumerate(poles):
        pole_node = i
        pos[pole_node] = tuple(pole)  # Add pole position to pos dictionary

    # Update node attributes in the graph
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
    df = load_data(excel_path)
    buildings = df[df['Name'] != 'Power Source'][['Latitude', 'Longitude']].values
    power_source = df[df['Name'] == 'Power Source'][['Latitude', 'Longitude']].values[0]
    
    num_poles = determine_num_poles(len(buildings))
    candidate_poles = kmeans_pole_placement(buildings, num_poles)
    updated_poles = ensure_pole_connections(buildings, candidate_poles)
    
    G, final_poles = enforce_graph_constraints(updated_poles, power_source)
    
    G = connect_buildings_to_poles(buildings, final_poles, G)
    
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
