#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';

export const scanDependencies = async (context = {}) => {
    const verbose = !context.entry_point;
    try {
        let report = { ok: true, vulnerabilities: {} };
        try {
            const out = execSync('npm audit --json', { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', timeout: 30000 });
            const json = JSON.parse(out);
            report.ok = json.ok;
            if (json.metadata && json.metadata.vulnerabilities) {
                report.vulnerabilities = json.metadata.vulnerabilities;
            }
            if (!report.ok && process.env.SAFE_NPM_AUDIT_FIX === '1') {
                try {
                    execSync('npm audit fix', { stdio: 'inherit' });
                    report.attempted_fix = true;
                } catch (e) {
                    report.attempted_fix = true;
                    report.fix_error = String(e.message || e);
                }
            }
        } catch (e) {
            // Fallback: no audit data
            report.ok = false;
            report.error = String(e.message || e);
        }
        if (!fs.existsSync('reports')) fs.mkdirSync('reports', { recursive: true });
        const pathOut = `reports/dependency_vuln_${Date.now()}.json`;
        fs.writeFileSync(pathOut, JSON.stringify(report, null, 2));
        const result = { success: true, dependency_scan_complete: true, ok: report.ok, report_path: pathOut, attempted_fix: !!report.attempted_fix };
        if (verbose) console.log(JSON.stringify(result));
        return result;
    } catch (e) {
        const fail = { success: false, dependency_scan_complete: false, error: String(e) };
        if (verbose) console.log(JSON.stringify(fail));
        return fail;
    }
};

export default { scanDependencies };
