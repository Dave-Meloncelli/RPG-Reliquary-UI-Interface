#!/usr/bin/env node
// SBOM & License frame (ESM)
import fs from 'fs';
import path from 'path';

const readJsonIfExists = (p) => {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch { }
  return null;
};

const readLinesIfExists = (p) => {
  try {
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean);
  } catch { }
  return [];
};

export const generateSbom = async (context = {}) => {
  const verbose = !context.entry_point;
  try {
    const rootPkg = readJsonIfExists('package.json') || {};
    const backendPkg = readJsonIfExists(path.join('backend', 'package.json')) || {};
    const reqTxt = readLinesIfExists('requirements.txt');
    const backendReq = readLinesIfExists(path.join('backend', 'requirements.txt'));

    const npmDeps = Object.entries({ ...(rootPkg.dependencies || {}), ...(backendPkg.dependencies || {}) })
      .map(([name, version]) => ({ ecosystem: 'npm', name, version, license: 'UNKNOWN' }));
    const pyDeps = [...reqTxt, ...backendReq]
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => ({ ecosystem: 'pypi', name: line.split('==')[0], version: (line.split('==')[1] || 'UNKNOWN'), license: 'UNKNOWN' }));

    const sbom = {
      metadata: { generatedAt: new Date().toISOString(), version: '0.1', tool: 'AZ-Interface SBOM Frame' },
      components: [...npmDeps, ...pyDeps]
    };

    // Simple SPDX policy
    const policyPath = path.join('config', 'security', 'spdx-policy.json');
    const exceptionsPath = path.join('config', 'security', 'spdx-exceptions.json');
    let allow = ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause'];
    let deny = ['GPL-3.0-only', 'AGPL-3.0-only'];
    let exceptions = [];
    try {
      if (fs.existsSync(policyPath)) {
        const p = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
        if (Array.isArray(p.allow)) allow = p.allow;
        if (Array.isArray(p.deny)) deny = p.deny;
      }
      if (fs.existsSync(exceptionsPath)) {
        const ex = JSON.parse(fs.readFileSync(exceptionsPath, 'utf8'));
        if (Array.isArray(ex.allow)) exceptions = ex.allow; // entries like "pkg" or "pkg@version"
      }
    } catch { }
    const licenseViolations = [];
    // Placeholder: license resolution unknown → flag for manual check
    for (const c of sbom.components) {
      const id = c.version && c.version !== 'UNKNOWN' ? `${c.name}@${c.version}` : c.name;
      if (exceptions.includes(id) || exceptions.includes(c.name)) {
        continue;
      }
      if (c.license && deny.includes(c.license)) {
        licenseViolations.push({ name: c.name, version: c.version, license: c.license, type: 'deny' });
      } else if (!c.license || (!allow.includes(c.license) && !deny.includes(c.license))) {
        licenseViolations.push({ name: c.name, version: c.version, license: c.license || 'UNKNOWN', type: 'review' });
      }
    }

    const reportsDir = 'reports';
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
    const file = path.join(reportsDir, `sbom_${Date.now()}.json`);
    fs.writeFileSync(file, JSON.stringify({ ...sbom, licenseViolations }, null, 2));

    const result = {
      success: true,
      sbom_generated: true,
      licenses_checked: true,
      data: { components: sbom.components.length, report_path: file, license_violations: licenseViolations.length },
      summary: `Generated SBOM with ${sbom.components.length} components`,
      context: { ecosystems: ['npm', 'pypi'] }
    };
    if (verbose) console.log(JSON.stringify(result));
    return result;
  } catch (error) {
    const fail = { success: false, error: String(error), sbom_generated: false, licenses_checked: false };
    if (verbose) console.log(JSON.stringify(fail));
    return fail;
  }
};

export default { generateSbom };
