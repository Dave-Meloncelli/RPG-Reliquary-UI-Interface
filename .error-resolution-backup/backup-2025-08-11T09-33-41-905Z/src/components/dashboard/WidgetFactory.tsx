import React, { type FC } from 'react';
import type { WidgetType } from '../../types';
import SystemStatusWidget from './SystemStatusWidget';
import KeyMetricsWidget from './KeyMetricsWidget';
import AgentStatusSummaryWidget from './AgentStatusSummaryWidget';

interface WidgetFactoryProps {
    type: WidgetType;
}

const WidgetFactory: FC<WidgetFactoryProps> = ({ type }) => {
    switch (type) {
        case 'SystemStatus':
            return <SystemStatusWidget />;
        case 'KeyMetrics':
            return <KeyMetricsWidget />;
        case 'AgentStatusSummary':
            return <AgentStatusSummaryWidget />;
        default:
            return <div>Unknown widget type</div>;
    }
};

export default WidgetFactory;