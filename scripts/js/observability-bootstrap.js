#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

export const bootstrapObservability = async (context = {}) => {
    const verbose = !context.entry_point;
    try {
        const dir = path.join('config', 'observability');
        fs.mkdirSync(dir, { recursive: true });
        const logConf = {
            level: 'info',
            format: 'json',
            fields: ['timestamp', 'level', 'message', 'component', 'requestId']
        };
        const file = path.join(dir, 'logging.json');
        fs.writeFileSync(file, JSON.stringify(logConf, null, 2));
        const result = {
            success: true,
            observability_bootstrapped: true,
            data: { logging_config: file },
            summary: 'Structured logging configuration created'
        };
        if (verbose) console.log(JSON.stringify(result));
        return result;
    } catch (e) {
        const fail = { success: false, observability_bootstrapped: false, error: String(e) };
        if (verbose) console.log(JSON.stringify(fail));
        return fail;
    }
};

export default { bootstrapObservability };
