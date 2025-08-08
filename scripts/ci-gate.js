#!/usr/bin/env node
import process from 'process';
import { scanSecrets } from './secrets-scan.js';
import { scanDependencies } from './dependency-vuln.js';

(async () => {
    const strict = process.env.CI_STRICT === '1';
    let fail = false;
    const results = {};

    try {
        results.secrets = await scanSecrets({ entry_point: 'ci' });
        const high = results.secrets.high_count || 0;
        if (high > 0) {
            console.error(`Secrets scan found ${high} high-severity findings`);
            fail = true;
        }
    } catch (e) {
        console.error('Secrets scan error:', e);
        if (strict) fail = true;
    }

    try {
        results.deps = await scanDependencies({ entry_point: 'ci' });
        if (results.deps.ok === false) {
            console.error('Dependency vulnerabilities detected');
            if (strict) fail = true;
        }
    } catch (e) {
        console.error('Dependency scan error:', e);
        if (strict) fail = true;
    }

    if (fail) {
        console.error('CI gate failed');
        process.exit(1);
    } else {
        console.log('CI gate passed');
        console.log(JSON.stringify(results));
    }
})();
