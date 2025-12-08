import apiClient from '../axios.config';
import { ENDPOINTS } from '../endpoints';
import type { GraphData, Node, Relationship, NodeFormData, RelationshipFormData } from '@/features/grafo/types/grafo.types';

export const grafoService = {
  async getGraph(): Promise<GraphData> {
    const response = await apiClient.get<GraphData>(ENDPOINTS.NEO4J.GRAPH);
    return response.data;
  },

  async createNode(data: NodeFormData): Promise<Node> {
    const response = await apiClient.post<Node>(ENDPOINTS.NEO4J.NODES.CREATE, data);
    return response.data;
  },

  async createRelationship(data: RelationshipFormData): Promise<Relationship> {
    const response = await apiClient.post<Relationship>(ENDPOINTS.NEO4J.RELATIONSHIPS.CREATE, data);
    return response.data;
  },

  async deleteNode(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.NEO4J.NODES.DELETE(id));
  },

  async deleteRelationship(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.NEO4J.RELATIONSHIPS.DELETE(id));
  },
};
