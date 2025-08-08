import { eventBus } from './eventBus';

export interface N8nWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  triggers: string[];
  nodes: N8nNode[];
  lastRun?: N8nWorkflowRun;
  executionCount: number;
  averageExecutionTime: number;
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  parameters: Record<string, any>;
  connections: Record<string, string[]>;
}

export interface N8nWorkflowRun {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
  executionData: N8nExecutionData[];
}

export interface N8nExecutionData {
  nodeId: string;
  nodeName: string;
  status: 'success' | 'error' | 'skipped';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  data?: any;
  error?: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  compare_at_price?: number;
  inventory_quantity: number;
  status: 'active' | 'draft' | 'archived';
  tags: string[];
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  metafields: ShopifyMetafield[];
}

export interface ShopifyImage {
  id: string;
  src: string;
  alt: string;
  position: number;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: number;
  compare_at_price?: number;
  inventory_quantity: number;
  sku: string;
  barcode?: string;
  weight?: number;
  weight_unit: string;
}

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: 'single_line_text_field' | 'multi_line_text_field' | 'number_integer' | 'number_decimal' | 'json';
}

export interface ImageValidationResult {
  isValid: boolean;
  qualityScore: number;
  detectedIssues: string[];
  conditionSuggestions: string[];
  requiresAdditionalPhotos: boolean;
  validationCriteria: {
    coverVisible: boolean;
    noExcessiveShadows: boolean;
    textReadable: boolean;
    damageAssessment: string;
    podDetection: boolean;
  };
}

export interface SocialMediaTemplate {
  id: string;
  name: string;
  platform: 'instagram' | 'facebook' | 'pinterest' | 'twitter';
  templateType: 'product_showcase' | 'collection_highlight' | 'educational' | 'nostalgic';
  promptTemplate: string;
  stylePreset: string;
  dimensions: { width: number; height: number };
  generatedImages: GeneratedImage[];
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  generatedAt: Date;
  usage: 'unused' | 'posted' | 'scheduled';
}

class N8nIntegrationService {
  private workflows: Map<string, N8nWorkflow> = new Map();
  private activeRuns: Map<string, N8nWorkflowRun> = new Map();
  private workflowHistory: N8nWorkflowRun[] = [];
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = 'http://localhost:5678', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey || '';
  }

  // Initialize with predefined RPG cataloging workflows
  async initializeWorkflows(): Promise<void> {
    const defaultWorkflows: N8nWorkflow[] = [
      this.createImageValidationWorkflow(),
      this.createShopifyAutomationWorkflow(),
      this.createSocialMediaGenerationWorkflow(),
      this.createInventoryMonitoringWorkflow(),
      this.createCustomerSupportWorkflow()
    ];

    for (const workflow of defaultWorkflows) {
      this.workflows.set(workflow.id, workflow);
    }

    console.log(`Initialized ${defaultWorkflows.length} n8n workflows`);
  }

  // Image Validation Workflow (adapted from n8n workflow 2420)
  private createImageValidationWorkflow(): N8nWorkflow {
    return {
      id: 'image-validation-rpg',
      name: 'RPG Book Image Validation',
      description: 'Validates RPG book cover images using AI vision for quality assessment',
      status: 'idle',
      triggers: ['webhook', 'manual'],
      nodes: [
        {
          id: 'webhook-trigger',
          name: 'Image Upload Webhook',
          type: 'n8n-nodes-base.webhook',
          position: { x: 100, y: 100 },
          parameters: {
            httpMethod: 'POST',
            path: 'rpg-image-validation',
            responseMode: 'responseNode'
          },
          connections: {}
        },
        {
          id: 'ai-vision-analysis',
          name: 'AI Vision Analysis',
          type: 'n8n-nodes-base.openAi',
          position: { x: 300, y: 100 },
          parameters: {
            operation: 'image',
            model: 'gpt-4-vision-preview',
            prompt: `Analyze this RPG book cover image for:
1. Book cover fully visible and centered
2. No excessive shadows or glare
3. All text readable for OCR
4. Damage assessment from visual inspection
5. POD (Print on Demand) detection from visual cues

Return JSON with:
{
  "isValid": boolean,
  "qualityScore": 1-10,
  "detectedIssues": [string],
  "conditionSuggestions": [string],
  "requiresAdditionalPhotos": boolean,
  "validationCriteria": {
    "coverVisible": boolean,
    "noExcessiveShadows": boolean,
    "textReadable": boolean,
    "damageAssessment": string,
    "podDetection": boolean
  }
}`
          },
          connections: {}
        },
        {
          id: 'validation-response',
          name: 'Validation Response',
          type: 'n8n-nodes-base.respondToWebhook',
          position: { x: 500, y: 100 },
          parameters: {
            responseCode: 200,
            responseBody: '={{ $json }}'
          },
          connections: {}
        }
      ],
      executionCount: 0,
      averageExecutionTime: 0
    };
  }

  // Shopify Multi-Module Automation Workflow (adapted from n8n workflow 4455)
  private createShopifyAutomationWorkflow(): N8nWorkflow {
    return {
      id: 'shopify-rpg-automation',
      name: 'Shopify RPG Automation',
      description: 'Advanced Shopify automation with AI agents for RPG business',
      status: 'idle',
      triggers: ['webhook', 'schedule'],
      nodes: [
        {
          id: 'shopify-webhook',
          name: 'Shopify Webhook',
          type: 'n8n-nodes-base.webhook',
          position: { x: 100, y: 100 },
          parameters: {
            httpMethod: 'POST',
            path: 'shopify-events',
            responseMode: 'responseNode'
          },
          connections: {}
        },
        {
          id: 'event-router',
          name: 'Event Router',
          type: 'n8n-nodes-base.switch',
          position: { x: 300, y: 100 },
          parameters: {
            rules: {
              rules: [
                {
                  conditions: {
                    string: [
                      {
                        value1: '={{ $json.topic }}',
                        operation: 'equals',
                        value2: 'products/create'
                      }
                    ]
                  },
                  outputIndex: 0
                },
                {
                  conditions: {
                    string: [
                      {
                        value1: '={{ $json.topic }}',
                        operation: 'equals',
                        value2: 'orders/create'
                      }
                    ]
                  },
                  outputIndex: 1
                },
                {
                  conditions: {
                    string: [
                      {
                        value1: '={{ $json.topic }}',
                        operation: 'equals',
                        value2: 'inventory_levels/update'
                      }
                    ]
                  },
                  outputIndex: 2
                }
              ]
            }
          },
          connections: {}
        },
        {
          id: 'product-enrichment',
          name: 'Product Enrichment',
          type: 'n8n-nodes-base.openAi',
          position: { x: 500, y: 50 },
          parameters: {
            operation: 'completion',
            model: 'gpt-4',
            prompt: `Enrich this RPG product listing with:
1. Detailed description highlighting rarity and collectibility
2. System compatibility information
3. Investment potential analysis
4. Collector interest indicators
5. SEO-optimized tags and keywords

Product: {{ $json.body.title }}
Publisher: {{ $json.body.vendor }}
Price: {{ $json.body.variants[0].price }}`
          },
          connections: {}
        },
        {
          id: 'customer-support',
          name: 'Customer Support',
          type: 'n8n-nodes-base.openAi',
          position: { x: 500, y: 150 },
          parameters: {
            operation: 'completion',
            model: 'gpt-4',
            prompt: `Generate customer support response for RPG order:
1. System compatibility questions
2. Publisher information requests
3. Investment advice for collectors
4. Condition assessment explanations

Order: {{ $json.body.order_number }}
Customer: {{ $json.body.customer.email }}`
          },
          connections: {}
        },
        {
          id: 'inventory-intelligence',
          name: 'Inventory Intelligence',
          type: 'n8n-nodes-base.openAi',
          position: { x: 500, y: 250 },
          parameters: {
            operation: 'completion',
            model: 'gpt-4',
            prompt: `Analyze inventory levels for RPG products:
1. Investment opportunity alerts
2. Rare book availability notifications
3. Market trend-based restocking
4. Collector interest tracking

Product: {{ $json.body.title }}
Current Stock: {{ $json.body.inventory_quantity }}`
          },
          connections: {}
        }
      ],
      executionCount: 0,
      averageExecutionTime: 0
    };
  }

  // Social Media Generation Workflow (adapted from n8n workflow 2417)
  private createSocialMediaGenerationWorkflow(): N8nWorkflow {
    return {
      id: 'social-media-generation',
      name: 'RPG Social Media Generation',
      description: 'Generates RPG-themed social media graphics using AI',
      status: 'idle',
      triggers: ['schedule', 'manual'],
      nodes: [
        {
          id: 'schedule-trigger',
          name: 'Daily Schedule',
          type: 'n8n-nodes-base.cron',
          position: { x: 100, y: 100 },
          parameters: {
            rule: {
              hour: 9,
              minute: 0
            }
          },
          connections: {}
        },
        {
          id: 'product-selector',
          name: 'Product Selector',
          type: 'n8n-nodes-base.shopify',
          position: { x: 300, y: 100 },
          parameters: {
            operation: 'getAll',
            resource: 'product',
            returnAll: false,
            limit: 5,
            filters: {
              tag: 'featured'
            }
          },
          connections: {}
        },
        {
          id: 'image-generator',
          name: 'AI Image Generator',
          type: 'n8n-nodes-base.openAi',
          position: { x: 500, y: 100 },
          parameters: {
            operation: 'image',
            model: 'dall-e-3',
            prompt: `Create a beautiful social media image for RPG book: {{ $json.title }}
Style: Vintage RPG book collection aesthetic with classic fantasy illustration
Include: Book cover, mystical elements, collector's display
Platform: Instagram square format
Mood: Nostalgic and premium collector feel`,
            size: '1024x1024',
            quality: 'hd'
          },
          connections: {}
        },
        {
          id: 'caption-generator',
          name: 'Caption Generator',
          type: 'n8n-nodes-base.openAi',
          position: { x: 700, y: 100 },
          parameters: {
            operation: 'completion',
            model: 'gpt-4',
            prompt: `Generate engaging Instagram caption for RPG book:
Title: {{ $json.title }}
Publisher: {{ $json.vendor }}
Price: {{ $json.variants[0].price }}

Include:
- Engaging hook
- Book significance
- Collector appeal
- Call to action
- Relevant hashtags

Keep under 2200 characters.`
          },
          connections: {}
        },
        {
          id: 'social-scheduler',
          name: 'Social Media Scheduler',
          type: 'n8n-nodes-base.buffer',
          position: { x: 900, y: 100 },
          parameters: {
            operation: 'create',
            text: '={{ $json.caption }}',
            media: {
              photo: '={{ $json.image_url }}'
            },
            scheduled_at: '={{ new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() }}'
          },
          connections: {}
        }
      ],
      executionCount: 0,
      averageExecutionTime: 0
    };
  }

  // Inventory Monitoring Workflow (adapted from n8n workflow 2027)
  private createInventoryMonitoringWorkflow(): N8nWorkflow {
    return {
      id: 'inventory-monitoring',
      name: 'RPG Inventory Monitoring',
      description: 'Monitors inventory levels with collector intelligence',
      status: 'idle',
      triggers: ['webhook', 'schedule'],
      nodes: [
        {
          id: 'inventory-check',
          name: 'Inventory Check',
          type: 'n8n-nodes-base.shopify',
          position: { x: 100, y: 100 },
          parameters: {
            operation: 'getAll',
            resource: 'product',
            returnAll: true,
            filters: {
              inventory_quantity: '<=5'
            }
          },
          connections: {}
        },
        {
          id: 'rarity-analyzer',
          name: 'Rarity Analyzer',
          type: 'n8n-nodes-base.openAi',
          position: { x: 300, y: 100 },
          parameters: {
            operation: 'completion',
            model: 'gpt-4',
            prompt: `Analyze RPG product rarity and investment potential:
Title: {{ $json.title }}
Publisher: {{ $json.vendor }}
Current Stock: {{ $json.variants[0].inventory_quantity }}
Price: {{ $json.variants[0].price }}

Assess:
1. Rarity level (common/rare/very rare/legendary)
2. Investment potential (low/medium/high/very high)
3. Collector interest level (1-10)
4. Recommended action (restock/raise price/feature)

Return JSON response.`
          },
          connections: {}
        },
        {
          id: 'discord-notification',
          name: 'Discord Notification',
          type: 'n8n-nodes-base.discord',
          position: { x: 500, y: 100 },
          parameters: {
            operation: 'postMessage',
            channelId: '{{ $env.DISCORD_CHANNEL_ID }}',
            text: `🚨 **Low Stock Alert: {{ $json.title }}**
📦 Current Stock: {{ $json.variants[0].inventory_quantity }}
💰 Price: {{ $json.variants[0].price }}
⭐ Rarity: {{ $json.rarity }}
💎 Investment Potential: {{ $json.investmentPotential }}
🎯 Collector Interest: {{ $json.collectorInterest }}/10

**Recommended Action:** {{ $json.recommendedAction }}

[View Product](https://yourstore.com/products/{{ $json.handle }})`
          },
          connections: {}
        }
      ],
      executionCount: 0,
      averageExecutionTime: 0
    };
  }

  // Customer Support Workflow
  private createCustomerSupportWorkflow(): N8nWorkflow {
    return {
      id: 'customer-support-automation',
      name: 'RPG Customer Support',
      description: 'Automated customer support for RPG inquiries',
      status: 'idle',
      triggers: ['webhook', 'email'],
      nodes: [
        {
          id: 'support-webhook',
          name: 'Support Webhook',
          type: 'n8n-nodes-base.webhook',
          position: { x: 100, y: 100 },
          parameters: {
            httpMethod: 'POST',
            path: 'customer-support',
            responseMode: 'responseNode'
          },
          connections: {}
        },
        {
          id: 'inquiry-classifier',
          name: 'Inquiry Classifier',
          type: 'n8n-nodes-base.openAi',
          position: { x: 300, y: 100 },
          parameters: {
            operation: 'completion',
            model: 'gpt-4',
            prompt: `Classify this RPG customer inquiry:
Inquiry: {{ $json.message }}

Categories:
1. System compatibility questions
2. Publisher information requests
3. Investment advice for collectors
4. Condition assessment explanations
5. Order status questions
6. General RPG knowledge

Return JSON: {"category": "string", "priority": "low/medium/high", "requiresHuman": boolean}`
          },
          connections: {}
        },
        {
          id: 'auto-response',
          name: 'Auto Response',
          type: 'n8n-nodes-base.openAi',
          position: { x: 500, y: 100 },
          parameters: {
            operation: 'completion',
            model: 'gpt-4',
            prompt: `Generate helpful response for RPG customer inquiry:
Category: {{ $json.category }}
Inquiry: {{ $json.originalMessage }}

Provide:
1. Knowledgeable, friendly response
2. Specific RPG expertise
3. Helpful resources or suggestions: suggestions
4. Professional tone
5. Clear next steps if needed

Keep under 500 words.`
          },
          connections: {}
        },
        {
          id: 'email-sender',
          name: 'Email Sender',
          type: 'n8n-nodes-base.emailSend',
          position: { x: 700, y: 100 },
          parameters: {
            toEmail: '={{ $json.customerEmail }}',
            subject: 'Re: {{ $json.subject }}',
            text: '={{ $json.response }}',
            fromEmail: 'support@yourrpgstore.com'
          },
          connections: {}
        }
      ],
      executionCount: 0,
      averageExecutionTime: 0
    };
  }

  // Execute workflow
  async executeWorkflow(workflowId: string, input?: any): Promise<N8nWorkflowRun> {
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }


    const run: N8nWorkflowRun = {
      id: runId,
      workflowId,
      status: 'running',
      startTime,
      input,
      executionData: []
    };

    this.activeRuns.set(runId, run);
    workflow.status = 'running';

    try {
      // Simulate workflow execution
      await this.simulateWorkflowExecution(workflow, run, input);

      run.status = 'completed';
      run.endTime = new Date();
      run.duration = run.endTime.getTime() - startTime.getTime();

      workflow.executionCount++;
      workflow.averageExecutionTime = 
        (workflow.averageExecutionTime * (workflow.executionCount - 1) + run.duration) / workflow.executionCount;

      // Publish event
      eventBus.publish('n8n.workflow.complete', { run });

    } catch (error) {
      run.status = 'failed';
      run.endTime = new Date();
      run.duration = run.endTime.getTime() - startTime.getTime();
      run.error = error instanceof Error ? error.message : 'Unknown error';

      // Publish event
      eventBus.publish('n8n.workflow.failed', { run, error: run.error });
    }

    workflow.status = 'idle';
    this.activeRuns.delete(runId);
    this.workflowHistory.push(run);

    return run;
  }

  // Simulate workflow execution
  private async simulateWorkflowExecution(workflow: N8nWorkflow, run: N8nWorkflowRun, input?: any): Promise<void> {
    for (const node of workflow.nodes) {
      
      const executionData: N8nExecutionData = {
        nodeId: node.id,
        nodeName: node.name,
        status: 'success',
        startTime: nodeStartTime
      };

      try {
        // Simulate node processing based on type
        await this.simulateNodeProcessing(node, input);
        
        executionData.endTime = new Date();
        executionData.duration = executionData.endTime.getTime() - nodeStartTime.getTime();
        executionData.data = { processed: true, nodeType: node.type };

      } catch (error) {
        executionData.status = 'error';
        executionData.endTime = new Date();
        executionData.duration = executionData.endTime.getTime() - nodeStartTime.getTime();
        executionData.error = error instanceof Error ? error.message : 'Unknown error';
        
        throw error;
      }

      run.executionData.push(executionData);
    }
  }

  // Simulate node processing
  private async simulateNodeProcessing(node: N8nNode, input?: any): Promise<void> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    // Simulate different node behaviors
    switch (node.type) {
      case 'n8n-nodes-base.openAi':
        // Simulate AI processing
        if (Math.random() < 0.1) { // 10% chance of error
          throw new Error('AI service temporarily unavailable');
        }
        break;
      
      case 'n8n-nodes-base.shopify':
        // Simulate Shopify API call
        if (Math.random() < 0.05) { // 5% chance of error
          throw new Error('Shopify API rate limit exceeded');
        }
        break;
      
      case 'n8n-nodes-base.webhook':
        // Simulate webhook processing
        break;
      
      default:
        // Generic node processing
        break;
    }
  }

  // Get workflow by ID
  getWorkflow(id: string): N8nWorkflow | undefined {
    return this.workflows.get(id);
  }

  // Get all workflows
  getAllWorkflows(): N8nWorkflow[] {
    return Array.from(this.workflows.values());
  }

  // Get active runs
  getActiveRuns(): N8nWorkflowRun[] {
    return Array.from(this.activeRuns.values());
  }

  // Get workflow history
  getWorkflowHistory(workflowId?: string): N8nWorkflowRun[] {
    if (workflowId) {
      return this.workflowHistory.filter(run => run.workflowId === workflowId);
    }
    return [...this.workflowHistory];
  }

  // Get workflow statistics
  getWorkflowStats(workflowId: string): {
    totalRuns: number;
    successRate: number;
    averageExecutionTime: number;
    lastRun?: Date;
  } {
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }


    return {
      totalRuns: runs.length,
      successRate: runs.length > 0 ? (successfulRuns / runs.length) * 100 : 0,
      averageExecutionTime: workflow.averageExecutionTime,
      lastRun
    };
  }

  // Update workflow configuration
  updateWorkflow(id: string, updates: Partial<N8nWorkflow>): void {
    if (!workflow) {
      throw new Error(`Workflow ${id} not found`);
    }

    Object.assign(workflow, updates);
  }

  // Delete workflow
  deleteWorkflow(id: string): boolean {
    return this.workflows.delete(id);
  }

  // Clear workflow history
  clearWorkflowHistory(): void {
    this.workflowHistory = [];
  }
}

export const n8nIntegrationService = new N8nIntegrationService(); 
