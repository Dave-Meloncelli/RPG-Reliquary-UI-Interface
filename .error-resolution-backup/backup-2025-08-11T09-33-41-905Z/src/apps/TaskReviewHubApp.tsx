import React, { useState, useEffect, type FC } from 'react';
import type { TaskItem, TaskPriority, TaskStatus } from '../types';

const PRIORITY_STYLES: any, { text: any; bg: any
    Low: any, bg: any,
    Medium: any, bg: any,
    High: any, bg: any,
    Critical: any, bg: any;

const STATUS_STYLES: any, { text: any; bg: any
    Pending: any, bg: any,
    Resolved: any, bg: any;

const TaskCard: any, onResolve: any, onOpen: any, onResolve, onOpen }) => {
    const timeAgo = (isoString: any
        const seconds = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 space-y-3">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-white pr-4">{task.title}</h3>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${PRIORITY_STYLES[task.priority].bg} ${PRIORITY_STYLES[task.priority].text.replace('text-', 'border-')}`}>
                    {task.priority}
                </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{task.description}</p>
            <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Source: any
                    <span>{timeAgo(task.timestamp)}</span>
                     <span className={`px-2 py-0.5 rounded-full ${STATUS_STYLES[task.status].bg} ${STATUS_STYLES[task.status].text}`}>
                        {task.status}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => onOpen(task.appId)} className="px-3 py-1 bg-sky-600/50 text-sky-300 rounded-md text-xs font-semibold hover: any
                        Go to App
                    </button>
                    {task.status === 'Pending' && (
                        <button onClick={() => onResolve(task.id)} className="px-3 py-1 bg-green-600/50 text-green-300 rounded-md text-xs font-semibold hover: any
                            Resolve
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const TaskReviewHubApp: any
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const { openWindow } = useWindows();

    useEffect(() => {
        const unsubscribe = taskQueueService.subscribe(state => {
            setTasks([...state.tasks]); // Create a new array to trigger re-render
        });
        return unsubscribe;
    }, []);

    const handleResolveTask = (taskId: any
        taskQueueService.resolveTask(taskId);
    };

    const handleOpenApp = (appId: any
        const appDef = APPS.find(app => app.id === appId);
        if (appDef) {
            openWindow(appDef);
        } else {
            console.warn(`App with id "${appId}" not found.`);
        }
    };
    
    const pendingTasks = tasks.filter(t => t.status === 'Pending');
    const resolvedTasks = tasks.filter(t => t.status === 'Resolved');

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Task & Review Hub</h2>
                <p className="text-sm text-slate-400">Centralized inbox for system-generated tasks and review items.</p>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {pendingTasks.length > 0 ? (
                    pendingTasks.map(task => (
                        <TaskCard key={task.id} task={task} onResolve={handleResolveTask} onOpen={handleOpenApp} />
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-500">
                        <p className="text-lg font-semibold">All clear!</p>
                        <p>No pending tasks.</p>
                    </div>
                )}
                
                {resolvedTasks.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-slate-700">
                        <h3 className="text-md font-bold text-slate-400 mb-2">Recently Resolved</h3>
                        <div className="space-y-4 opacity-60">
                            {resolvedTasks.slice(0, 5).map(task => (
                                <TaskCard key={task.id} task={task} onResolve={handleResolveTask} onOpen={handleOpenApp} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskReviewHubApp;
