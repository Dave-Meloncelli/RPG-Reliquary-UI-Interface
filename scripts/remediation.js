#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

function latestFile(dir, prefix) {
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir).filter(f => f.startsWith(prefix)).map(f => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs }));
    if (!files.length) return null;
    files.sort((a, b) => b.t - a.t);
    return path.join(dir, files[0].f);
}

function loadJSON(p) {
    try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

export const generateRemediationPlan = async (context = {}) => {
    const verbose = !context.entry_point;
    try {
        const reportsDir = 'reports';
        const sbomPath = latestFile(reportsDir, 'sbom_');
        const depPath = latestFile(reportsDir, 'dependency_vuln_');
        const secretsPath = latestFile(reportsDir, 'secrets_scan_');

        const sbom = sbomPath ? loadJSON(sbomPath) : null;
        const deps = depPath ? loadJSON(depPath) : null;
        const secrets = secretsPath ? loadJSON(secretsPath) : null;

        const actions = [];
        const commands = [];

        if (deps && deps.ok === false) {
            actions.push({ kind: 'dependency', title: 'Resolve dependency vulnerabilities', priority: 'high' });
            commands.push('npm audit fix');
            commands.push('npm audit fix --force # review breaking changes before running');
        }

        if (secrets && Array.isArray(secrets.findings) && secrets.findings.length) {
            const high = secrets.findings.filter(f => f.severity === 'high');
            actions.push({ kind: 'secrets', title: `Rotate and remove exposed secrets (${high.length} high)`, priority: 'critical' });
            actions.push({ kind: 'secrets', title: 'Add false-positive patterns to config/security/secrets-allowlist.json', priority: 'medium' });
        }

        if (sbom && sbom.data && sbom.data.components) {
            actions.push({ kind: 'sbom', title: 'Verify licenses and add SPDX allowlist/denylist', priority: 'medium' });
        }

        const plan = { generated_at: new Date().toISOString(), inputs: { sbomPath, depPath, secretsPath }, actions, commands };
        if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
        const out = path.join(reportsDir, `remediation_plan_${Date.now()}.json`);
        fs.writeFileSync(out, JSON.stringify(plan, null, 2));

        // Standard success result for framework consumption
        const result = {
            success: true,
            remediation_generated: true,
            plan_path: out,
            summary: `Generated remediation plan with ${actions.length} actions`,
            context: { actions_count: actions.length, commands_count: commands.length }
        };

        // When run as a frame, ONLY emit the success result
        if (context && context.entry_point) {
            console.log(JSON.stringify(result));
            return result;
        } else {
            // When run standalone, emit both success and plan details
            console.log(JSON.stringify(result));
            console.log(JSON.stringify(plan));
            return plan;
        }
    } catch (e) {
        const fail = {
            success: false,
            remediation_generated: false,
            error: String(e),
            summary: 'Remediation plan generation failed'
        };
        if (verbose) console.log(JSON.stringify(fail));
        return fail;
    }
};

if (import.meta.url === `file://${process.argv[1]}`) {
    generateRemediationPlan();
}
