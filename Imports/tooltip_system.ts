// src/components/ui/Tooltip.tsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  delay?: number;
  className?: string;
  interactive?: boolean;
  maxWidth?: number;
  showArrow?: boolean;
  trigger?: 'hover' | 'click' | 'focus';
  documentationLink?: string;
  techDetails?: TechDetails;
}

interface TechDetails {
  component: string;
  version?: string;
  dependencies?: string[];
  lastUpdated?: string;
  status?: 'stable' | 'beta' | 'deprecated' | 'experimental';
  docs?: string;
  issues?: Issue[];
}

interface Issue {
  type: 'bug' | 'feature' | 'security' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  link?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'auto',
  delay = 300,
  className = '',
  interactive = false,
  maxWidth = 300,
  showArrow = true,
  trigger = 'hover',
  documentationLink,
  techDetails,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const targetRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!interactive) setIsVisible(false);
  };

  const calculatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return;
    
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let newPosition = position;
    
    if (position === 'auto') {
      // Auto-calculate best position
      const spaceTop = targetRect.top;
      const spaceBottom = viewport.height - targetRect.bottom;
      const spaceLeft = targetRect.left;
      const spaceRight = viewport.width - targetRect.right;
      
      if (spaceBottom >= tooltipRect.height) newPosition = 'bottom';
      else if (spaceTop >= tooltipRect.height) newPosition = 'top';
      else if (spaceRight >= tooltipRect.width) newPosition = 'right';
      else newPosition = 'left';
    }
    
    setActualPosition(newPosition);
  };

  useEffect(() => {
    if (isVisible) calculatePosition();
  }, [isVisible]);

  const triggerProps = {
    ...(trigger === 'hover' && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
    }),
    ...(trigger === 'click' && {
      onClick: () => setIsVisible(!isVisible),
    }),
    ...(trigger === 'focus' && {
      onFocus: showTooltip,
      onBlur: hideTooltip,
    }),
  };

  const renderTechDetails = () => {
    if (!techDetails) return null;
    
    return (
      <div className="mt-3 pt-3 border-t border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-300">
            {techDetails.component}
          </span>
          {techDetails.version && (
            <span className="text-xs text-gray-400">v{techDetails.version}</span>
          )}
        </div>
        
        {techDetails.status && (
          <div className="mb-2">
            <StatusBadge status={techDetails.status} />
          </div>
        )}
        
        {techDetails.dependencies && techDetails.dependencies.length > 0 && (
          <div className="mb-2">
            <span className="text-xs text-gray-400">Dependencies:</span>
            <div className="text-xs text-gray-300 mt-1">
              {techDetails.dependencies.join(', ')}
            </div>
          </div>
        )}
        
        {techDetails.issues && techDetails.issues.length > 0 && (
          <div className="mb-2">
            <span className="text-xs text-gray-400">Issues:</span>
            {techDetails.issues.map((issue, idx) => (
              <IssueBadge key={idx} issue={issue} />
            ))}
          </div>
        )}
        
        {techDetails.lastUpdated && (
          <div className="text-xs text-gray-500">
            Updated: {new Date(techDetails.lastUpdated).toLocaleDateString()}
          </div>
        )}
      </div>
    );
  };

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={`
        fixed z-50 px-3 py-2 text-sm text-white bg-gray-800 border border-gray-600 rounded-lg shadow-lg
        ${className}
      `}
      style={{ maxWidth }}
      onMouseEnter={() => interactive && setIsVisible(true)}
      onMouseLeave={() => interactive && hideTooltip()}
    >
      <div>{content}</div>
      {renderTechDetails()}
      
      {documentationLink && (
        <div className="mt-2 pt-2 border-t border-gray-600">
          <a
            href={documentationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            📖 View Documentation
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
      
      {showArrow && (
        <div className={`absolute w-2 h-2 bg-gray-800 border border-gray-600 transform rotate-45 tooltip-arrow-${actualPosition}`} />
      )}
    </div>
  );

  return (
    <>
      <div ref={targetRef} className="inline-block" {...triggerProps}>
        {children}
      </div>
      {isVisible && createPortal(tooltipContent, document.body)}
    </>
  );
};

const StatusBadge: React.FC<{ status: TechDetails['status'] }> = ({ status }) => {
  const colors = {
    stable: 'bg-green-600 text-green-100',
    beta: 'bg-yellow-600 text-yellow-100',
    deprecated: 'bg-red-600 text-red-100',
    experimental: 'bg-purple-600 text-purple-100',
  };

  return (
    <span className={`text-xs px-2 py-1 rounded ${colors[status!]}`}>
      {status}
    </span>
  );
};

const IssueBadge: React.FC<{ issue: Issue }> = ({ issue }) => {
  const severityColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    critical: 'text-red-400',
  };

  const typeIcons = {
    bug: '🐛',
    feature: '✨',
    security: '🔒',
    performance: '⚡',
  };

  return (
    <div className="text-xs mt-1 flex items-center gap-1">
      <span>{typeIcons[issue.type]}</span>
      <span className={severityColors[issue.severity]}>
        {issue.severity.toUpperCase()}
      </span>
      <span className="text-gray-300">{issue.description}</span>
      {issue.link && (
        <a href={issue.link} className="text-blue-400 hover:text-blue-300">
          🔗
        </a>
      )}
    </div>
  );
};

// Usage Hook for easy integration
export const useTooltip = () => {
  const showTooltip = (element: HTMLElement, content: string, options?: Partial<TooltipProps>) => {
    // Implementation for programmatic tooltip display
  };

  const hideTooltip = () => {
    // Implementation for hiding tooltip
  };

  return { showTooltip, hideTooltip };
};