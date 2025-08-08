#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const SECRET_PATTERNS = [
    /aws(.{0,20})?(access|secret)[=_:\s"']+([A-Za-z0-9\/+=]{20,})/ig,
    /api[_-]?key[=_:\s"']+([A-Za-z0-9-_]{16,})/ig,
    /secret[=_:\s"']+([A-Za-z0-9\/+=]{12,})/ig,
    /password[=_:\s"']+([^\s"']{6,})/ig,
    /ghp_[A-Za-z0-9]{36,}/ig,
    /AKIA[0-9A-Z]{16}/g
];

function globToRegExp(glob) {
    const esc = glob.replace(/[.+^${}()|\[\]\\]/g, "\\$&").replace(/\*\*/g, "[\\s\\S]*").replace(/\*/g, "[^/\\\\]*");
    return new RegExp("^" + esc + "$", "i");
}

function loadAllowlist() {
    const allows = { ignoreFiles: [], ignorePatterns: [] };
    try {
        const p = path.join('config', 'security', 'secrets-allowlist.json');
        if (fs.existsSync(p)) {
            const j = JSON.parse(fs.readFileSync(p, 'utf8'));
            if (Array.isArray(j.ignoreFiles)) allows.ignoreFiles = j.ignoreFiles;
            if (Array.isArray(j.ignorePatterns)) allows.ignorePatterns = j.ignorePatterns.map(s => new RegExp(s, 'i'));
        }
    } catch { }
    try {
        const p2 = '.secretsignore';
        if (fs.existsSync(p2)) {
            const lines = fs.readFileSync(p2, 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            allows.ignoreFiles.push(...lines);
        }
    } catch { }
    return allows;
}

function walk(dir, filelist = [], ignoreRes = []) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const f of files) {
        if (f.name.startsWith('.') || ['node_modules', 'venv', '.git'].includes(f.name)) continue;
        const p = path.join(dir, f.name);
        if (ignoreRes.some(rx => rx.test(p.replace(/\\/g, '/')))) continue;
        if (f.isDirectory()) walk(p, filelist, ignoreRes); else filelist.push(p);
    }
    return filelist;
}

export const scanSecrets = async (context = {}) => {
    const verbose = !context.entry_point;
    try {
        const root = process.cwd();
        const allow = loadAllowlist();
        const ignoreRes = allow.ignoreFiles.map(globToRegExp);
        const files = walk(root, [], ignoreRes);
        const findings = [];
        for (const f of files) {
            const ext = path.extname(f).toLowerCase();
            if (['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.lock', '.zip'].includes(ext)) continue;
            let data = '';
            try { data = fs.readFileSync(f, 'utf8'); } catch { continue; }
            const isEnvFile = /(^|[\\/])(.env.*|.*\.(env|ini|yaml|yml|cfg|conf|toml))$/i.test(f);
            for (const re of SECRET_PATTERNS) {
                re.lastIndex = 0;
                let m;
                while ((m = re.exec(data)) !== null) {
                    const sample = m[0];
                    if (allow.ignorePatterns.some(r => r.test(sample))) continue;
                    const isKnownToken = /^ghp_[A-Za-z0-9]{36,}$/.test(sample) || /AKIA[0-9A-Z]{16}/.test(sample);
                    const isSensitiveLabel = /(secret|token|api[_-]?key)/i.test(sample);
                    const severity = (isKnownToken || (isEnvFile && isSensitiveLabel)) ? 'high' : 'medium';
                    findings.push({ file: path.relative(root, f), pattern: re.source, sample: sample.slice(0, 64), severity });
                }
            }
        }
        const reportsDir = 'reports';
        if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
        const out = path.join(reportsDir, `secrets_scan_${Date.now()}.json`);
        fs.writeFileSync(out, JSON.stringify({ findings }, null, 2));
        const highCount = findings.filter(f => f.severity === 'high').length;
        const result = { success: true, secrets_scan_complete: true, findings_count: findings.length, high_count: highCount, report_path: out };
        if (verbose) console.log(JSON.stringify(result));
        return result;
    } catch (e) {
        const fail = { success: false, secrets_scan_complete: false, error: String(e) };
        if (verbose) console.log(JSON.stringify(fail));
        return fail;
    }
};

export default { scanSecrets };
