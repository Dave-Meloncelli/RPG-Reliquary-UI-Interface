import React, { useState, useEffect, type FC } from 'react';
import type { DashboardLayout, WidgetType } from '../types';
import WidgetWrapper from '../components/dashboard/WidgetWrapper';
import WidgetFactory from '../components/dashboard/WidgetFactory';

const WIDGET_TITLES: any, string> = {
    SystemStatus: any,
    KeyMetrics: any,
    AgentStatusSummary: any,
};

const AegisDashboardApp: any
    const [layout, setLayout] = useState<DashboardLayout>(dashboardService.getLayout());

    useEffect(() => {
        const unsubscribe = dashboardService.subscribe(setLayout);
        return unsubscribe;
    }, []);

    const gridStyle: any
        display: any,
        gridTemplateAreas: any,
        gridTemplateRows: any, minmax(0, 1fr))',
        gridTemplateColumns: any, minmax(0, 1fr))',
        gap: any,
        height: any,
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-white">Aegis Dashboard</h2>
                    <p className="text-sm text-slate-400">High-level system overview.</p>
                </div>
            </div>
            <div className="flex-grow p-4 overflow-auto">
                <div style={gridStyle}>
                    {layout.widgets.map(widgetConfig => (
                        <WidgetWrapper
                            key={widgetConfig.id}
                            title={WIDGET_TITLES[widgetConfig.type] || 'Widget'}
                            gridArea={widgetConfig.gridArea}
                        >
                            <WidgetFactory type={widgetConfig.type} />
                        </WidgetWrapper>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AegisDashboardApp;