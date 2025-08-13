interface N8nNode {
  id: string;
  name: string;
  type: string;
}

interface N8nWorkflow {
  id: string;
  name: string;
  nodes: N8nNode[];
}

interface N8nExecutionData {
  id: string;
  status: string;
  data: any;
}

class N8nIntegrationService {
  private workflows: Map<string, N8nWorkflow> = new Map();
  private workflowHistory: N8nExecutionData[] = [];

  async createWorkflow(name: string, nodes: N8nNode[]): Promise<N8nWorkflow> {
    const workflow: N8nWorkflow = {
      id: Date.now().toString(),
      name,
      nodes
    };
    
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  async executeWorkflow(workflowId: string, inputData: any): Promise<N8nExecutionData> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const executionData: N8nExecutionData = {
      id: Date.now().toString(),
      status: 'running',
      data: inputData
    };

    try {
      for (const node of workflow.nodes) {
        await this.simulateNodeProcessing(node, executionData.data);
      }
      
      executionData.status = 'completed';
      this.workflowHistory.push(executionData);
      
      return executionData;
    } catch (error) {
      executionData.status = 'failed';
      this.workflowHistory.push(executionData);
      throw error;
    }
  }

  private async simulateNodeProcessing(node: N8nNode, input?: unknown): Promise<void> {
    // Simulate node processing
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  updateWorkflow(id: string, updates: Partial<N8nWorkflow>): N8nWorkflow | null {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      return null;
    }

    Object.assign(workflow, updates);
    return workflow;
  }

  deleteWorkflow(id: unknown): boolean {
    return this.workflows.delete(id as string);
  }

  clearWorkflowHistory(): void {
    this.workflowHistory = [];
  }

  getWorkflows(): N8nWorkflow[] {
    return Array.from(this.workflows.values());
  }

  getWorkflowHistory(): N8nExecutionData[] {
    return this.workflowHistory;
  }
}

export const n8nIntegrationService = new N8nIntegrationService();
