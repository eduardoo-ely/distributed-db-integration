/**
 * Neo4j Graph Types
 */

import { z } from 'zod';

export interface Node {
  id: string;
  label: string;
  properties: Record<string, any>;
}

export interface Relationship {
  id: string;
  type: string;
  startNodeId: string;
  endNodeId: string;
  properties: Record<string, any>;
}

export interface GraphData {
  nodes: Node[];
  relationships: Relationship[];
}

export const nodeSchema = z.object({
  label: z.string().min(1, 'Label é obrigatório'),
  properties: z.record(z.any()).optional(),
});

export const relationshipSchema = z.object({
  type: z.string().min(1, 'Type é obrigatório'),
  startNodeId: z.string().min(1, 'Nó inicial é obrigatório'),
  endNodeId: z.string().min(1, 'Nó final é obrigatório'),
  properties: z.record(z.any()).optional(),
});

export type NodeFormData = z.infer<typeof nodeSchema>;
export type RelationshipFormData = z.infer<typeof relationshipSchema>;
