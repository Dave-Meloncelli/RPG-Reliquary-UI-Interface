import React, { useState, useEffect, type FC } from 'react';
import { 
  concurrentAgentService, 
  submitConcurrentTask, 
  getConcurrentSystemStatus,
  getConcurrentTasks,
  type ConcurrentTask,
  type AgentWorkload 
} from '../services/concurrentAgentService';
import { getInitialAgentData } from '../services/agentData';
import type { AgentProfile, TaskPriority } from '../types/types';

const TaskPriorityBadge: FC<{ priority: TaskPriority }> = ({ priority }) => {
  const colors = {
    Critical: 'bg-red-500 text-white',
    High: 'bg-orange-500 text-white',
    Medium: 'bg-yellow-500 text-black',
    Low: 'bg-green-500 text-white'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[priority]}`}>
      {priority}
    </span>
  );
};

const TaskStatusBadge: FC<{ status: ConcurrentTask['status'] }> = ({ status }) => {
  const colors = {
    pending: 'bg-slate-500 text-white',
    running: 'bg-blue-500 text-white animate-pulse',
    completed: 'bg-green-500 text-white',
    failed: 'bg-red-500 text-white'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

const AgentWorkloadCard: FC<{ workload: AgentWorkload; agent: AgentProfile }> = ({ workload, agent }) => {
  const loadPercentage = Math.round(workload.currentLoad * 100);
  const loadColor = workload.currentLoad > 0.8 ? 'bg-red-500' : 
                   workload.currentLoad > 0.5 ? 'bg-yellow-500' : 'bg-green-500';
  
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 flex-shrink-0 bg-indigo-600 rounded-md flex items-center justify-center text-white">
          <agent.icon />
        </div>
        <div className="min-w-0 flex-grow">
          <p className="font-bold text-white truncate">{agent.name}</p>
          <p className="text-xs text-slate-400">{workload.currentTasks.length}/{workload.maxConcurrentTasks} tasks</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-white">{loadPercentage}%</div>
          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${loadColor} transition-all duration-300`}
              style={{ width: `${loadPercentage}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-400">Current Tasks:</p>
        {workload.currentTasks.length === 0 ? (
          <p className="text-xs text-slate-500 italic">Idle</p>
        ) : (
          workload.currentTasks.map(task => (
            <div key={task.id} className="text-xs bg-slate-700/50 rounded p-2">
              <div className="flex justify-between items-start mb-1">
                <span className="text-slate-300 font-semibold">{task.taskType}</span>
                <TaskStatusBadge status={task.status} />
              </div>
              <p className="text-slate-400">{task.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const TaskCard: FC<{ task: ConcurrentTask; agent: AgentProfile }> = ({ task, agent }) => {
  const duration = task.startTime && task.endTime 
    ? Math.round((task.endTime.getTime() - task.startTime.getTime()) / 1000)
    : task.startTime 
    ? Math.round((Date.now() - task.startTime.getTime()) / 1000)
    : 0;

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex-shrink-0 bg-indigo-600 rounded-md flex items-center justify-center text-white text-xs">
            <agent.icon />
          </div>
          <span className="font-bold text-white">{agent.name}</span>
        </div>
        <div className="flex gap-2">
          <TaskPriorityBadge priority={task.priority} />
          <TaskStatusBadge status={task.status} />
        </div>
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="text-sm font-semibold text-slate-300">{task.taskType}</p>
          <p className="text-sm text-slate-400">{task.description}</p>
        </div>
        
        {task.startTime && (
          <div className="text-xs text-slate-500">
            Started: {task.startTime.toLocaleTimeString()}
            {task.status === 'running' && ` (${duration}s)`}
          </div>
        )}
        
        {task.result && (
          <div className="text-xs bg-green-500/20 border border-green-500/30 rounded p-2">
            <p className="text-green-400 font-semibold">Result:</p>
            <p className="text-green-300">{JSON.stringify(task.result, null, 2)}</p>
          </div>
        )}
        
        {task.error && (
          <div className="text-xs bg-red-500/20 border border-red-500/30 rounded p-2">
            <p className="text-red-400 font-semibold">Error:</p>
            <p className="text-red-300">{task.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ConcurrentAgentHubApp: FC = () => {
  const [agents] = useState<AgentProfile[]>(getInitialAgentData());
  const [tasks, setTasks] = useState<ConcurrentTask[]>([]);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [taskType, setTaskType] = useState<string>('data_analysis');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Medium');
  const [estimatedDuration, setEstimatedDuration] = useState<number>(3000);

  useEffect(() => {
    const updateData = () => {
      setTasks(getConcurrentTasks());
      setSystemStatus(getConcurrentSystemStatus());
    };

    updateData();
    const interval = setInterval(updateData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmitTask = async () => {
    if (!selectedAgent || !taskDescription.trim()) return;

    try {
      await submitConcurrentTask(
        selectedAgent,
        taskType,
        taskDescription,
        taskPriority,
        estimatedDuration
      );
      
      // Reset form
      setTaskDescription('');
      setTaskPriority('Medium');
      setEstimatedDuration(3000);
    } catch (error) {
      console.error('Failed to submit task:', error);
    }
  };

  const handleSubmitMultipleTasks = async () => {
    const taskTypes = ['data_analysis', 'content_generation', 'monitoring', 'decision_analysis'];
    const descriptions = [
      'Analyze system performance metrics',
      'Generate weekly report content',
      'Monitor network security status',
      'Evaluate strategic options'
    ];
    
    for (let i = 0; i < 4; i++) {
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const randomPriority = ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)] as TaskPriority;
      
      await submitConcurrentTask(
        randomAgent.id,
        taskTypes[i],
        descriptions[i],
        randomPriority,
        2000 + Math.random() * 3000
      );
    }
  };

  const getAgentById = (agentId: string) => agents.find(a => a.id === agentId);

  return (
    <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Concurrent Agent Hub</h2>
        <p className="text-sm text-slate-400">Manage multiple agents working on different tasks simultaneously</p>
      </div>

      {/* System Status */}
      {systemStatus && (
        <div className="p-4 bg-slate-800/50 border-b border-slate-700/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{systemStatus.totalTasks}</p>
              <p className="text-xs text-slate-400">Total Tasks</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{systemStatus.runningTasks}</p>
              <p className="text-xs text-slate-400">Running</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">{systemStatus.queuedTasks}</p>
              <p className="text-xs text-slate-400">Queued</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{systemStatus.maxConcurrency}</p>
              <p className="text-xs text-slate-400">Max Concurrency</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow p-4 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Task Submission */}
          <div className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-4">Submit New Task</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Agent</label>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                  >
                    <option value="">Select an agent...</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Task Type</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                  >
                    <option value="data_analysis">Data Analysis</option>
                    <option value="content_generation">Content Generation</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="decision_analysis">Decision Analysis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                    rows={3}
                    placeholder="Describe the task..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Priority</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Duration (ms)</label>
                    <input
                      type="number"
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                      min="1000"
                      max="10000"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSubmitTask}
                    disabled={!selectedAgent || !taskDescription.trim()}
                    className="flex-grow bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    Submit Task
                  </button>
                  <button
                    onClick={handleSubmitMultipleTasks}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    Submit 4 Random Tasks
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Workloads */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Agent Workloads</h3>
              <div className="space-y-3">
                {systemStatus?.agentWorkloads.map((workload: AgentWorkload) => {
                  const agent = getAgentById(workload.agentId);
                  if (!agent) return null;
                  return (
                    <AgentWorkloadCard key={workload.agentId} workload={workload} agent={agent} />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Task List */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">All Tasks</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No tasks submitted yet</p>
              ) : (
                tasks.map(task => {
                  const agent = getAgentById(task.agentId);
                  if (!agent) return null;
                  return (
                    <TaskCard key={task.id} task={task} agent={agent} />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcurrentAgentHubApp; 