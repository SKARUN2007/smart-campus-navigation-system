import { CampusEdge, CampusNode, CampusLocationItem } from '@/types/campus';
import { CAMPUS_NODES, CAMPUS_EDGES } from '@/data/campusPaths';
import { CAMPUS_LOCATIONS } from '@/data/campusLocations';

export interface GraphNeighbor {
  nodeId: string;
  distance: number;
  edge: CampusEdge;
}

export class CampusGraph {
  public nodes: Map<string, CampusNode> = new Map();
  public edges: Map<string, CampusEdge> = new Map();
  public adjacency: Map<string, GraphNeighbor[]> = new Map();
  private locationToNode: Map<string, string> = new Map();

  constructor(
    nodesList: CampusNode[] = CAMPUS_NODES,
    edgesList: CampusEdge[] = CAMPUS_EDGES,
    locationsList: CampusLocationItem[] = CAMPUS_LOCATIONS
  ) {
    this.init(nodesList, edgesList, locationsList);
  }

  private init(
    nodesList: CampusNode[],
    edgesList: CampusEdge[],
    locationsList: CampusLocationItem[]
  ) {
    // 1. Index all nodes
    for (const node of nodesList) {
      this.nodes.set(node.id, node);
      this.adjacency.set(node.id, []);
    }

    // 2. Index all edges (bidirectional by default on campus walkways)
    for (const edge of edgesList) {
      this.edges.set(edge.id, edge);

      if (this.nodes.has(edge.from) && this.nodes.has(edge.to)) {
        // Forward edge
        this.adjacency.get(edge.from)?.push({
          nodeId: edge.to,
          distance: edge.distance,
          edge,
        });

        // Backward edge (pedestrian paths are bidirectional)
        this.adjacency.get(edge.to)?.push({
          nodeId: edge.from,
          distance: edge.distance,
          edge,
        });
      }
    }

    // 3. Map locations to graph nodes
    for (const loc of locationsList) {
      // Direct locationId mapping if specified on node
      let matchedNode: CampusNode | undefined = nodesList.find(
        (n) => n.locationId === loc.id
      );

      // BuildingId mapping if location doesn't have an exact node
      if (!matchedNode && loc.buildingId) {
        matchedNode = nodesList.find((n) => n.buildingId === loc.buildingId);
      }

      // Proximity fallback based on (markerX, markerY)
      if (!matchedNode) {
        let minDistance = Infinity;
        for (const n of nodesList) {
          const d = Math.hypot(n.x - loc.markerX, n.y - loc.markerY);
          if (d < minDistance) {
            minDistance = d;
            matchedNode = n;
          }
        }
      }

      if (matchedNode) {
        this.locationToNode.set(loc.id, matchedNode.id);
        this.locationToNode.set(loc.name.toLowerCase(), matchedNode.id);
        this.locationToNode.set(loc.code.toLowerCase(), matchedNode.id);
      }
    }

    // Also register node labels directly for quick lookup
    for (const node of nodesList) {
      this.locationToNode.set(node.id.toLowerCase(), node.id);
      this.locationToNode.set(node.name.toLowerCase(), node.id);
    }
  }

  public getNode(nodeId: string): CampusNode | undefined {
    return this.nodes.get(nodeId);
  }

  public getNeighbors(
    nodeId: string,
    options?: {
      requireAccessible?: boolean;
      excludedEdgeIds?: Set<string>;
      penalizedEdgeIds?: Map<string, number>;
    }
  ): GraphNeighbor[] {
    const raw = this.adjacency.get(nodeId) || [];
    return raw
      .filter(({ edge }) => {
        if (!edge.available) return false;
        if (options?.requireAccessible && !edge.accessible) return false;
        if (options?.excludedEdgeIds && options.excludedEdgeIds.has(edge.id)) return false;
        return true;
      })
      .map((neighbor) => {
        let weight = neighbor.distance;
        if (options?.penalizedEdgeIds?.has(neighbor.edge.id)) {
          weight *= options.penalizedEdgeIds.get(neighbor.edge.id)!;
        }
        return {
          ...neighbor,
          distance: weight,
        };
      });
  }

  public getEdgeBetween(nodeAId: string, nodeBId: string): CampusEdge | undefined {
    const list = this.adjacency.get(nodeAId) || [];
    const found = list.find((item) => item.nodeId === nodeBId);
    return found?.edge;
  }

  public resolveNodeForLocation(identifier: string): CampusNode | null {
    if (!identifier) return null;
    const trimmed = identifier.trim().toLowerCase();
    const nodeId = this.locationToNode.get(trimmed);
    if (nodeId && this.nodes.has(nodeId)) {
      return this.nodes.get(nodeId)!;
    }

    // Partial search match against location names
    for (const [key, val] of this.locationToNode.entries()) {
      if (key.includes(trimmed) || trimmed.includes(key)) {
        if (this.nodes.has(val)) return this.nodes.get(val)!;
      }
    }

    return null;
  }
}

// Global default singleton instance
export const defaultCampusGraph = new CampusGraph();

