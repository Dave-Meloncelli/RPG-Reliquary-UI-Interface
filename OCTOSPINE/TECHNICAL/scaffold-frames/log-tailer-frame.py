#!/usr/bin/env python3
"""
Log Tailer Frame
Lightweight polling-based tailer that batches new/changed report files and triggers Deep Pattern Recognition on small, recent subsets.
"""

import json
import os
import sys
import time
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
import traceback
import subprocess

DEFAULT_REPORTS_DIR = "reports"
SUPPORTED_EXTENSIONS = {".json"}


def list_recent_reports(directory: str, since_epoch: float, max_files: int = 10, exclude_large_mb: float = 50.0) -> List[Path]:
    base = Path(directory)
    if not base.exists():
        return []
    # Collect files modified after since_epoch, small enough, sorted by mtime ascending
    candidates: List[Tuple[float, Path]] = []
    for fp in base.glob("*.json"):
        try:
            stat = fp.stat()
            size_mb = stat.st_size / (1024 * 1024)
            if stat.st_mtime > since_epoch and size_mb <= exclude_large_mb:
                candidates.append((stat.st_mtime, fp))
        except Exception:
            continue
    candidates.sort(key=lambda t: t[0])
    files = [p for _, p in candidates][-max_files:]
    # Exclude known invalid report filenames to avoid parse noise
    exclude_names = {
        'smart_delegator_report.json',
        'deep_pattern_recognition_1754661236.json',
    }
    return [p for p in files if p.name not in exclude_names]


def run_deep_pattern_recognition_for(files: List[Path], timeout_sec: int = 120) -> Dict[str, Any]:
    if not files:
        return {"success": True, "deep_pattern_recognition_complete": False, "message": "No new files"}
    cmd = [sys.executable, "scripts/deep-pattern-recognition-frame.py", "--files"] + [str(f) for f in files]
    try:
        start = time.time()
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout_sec, encoding="utf-8", errors="replace")
        dur = time.time() - start
        if proc.returncode != 0:
            return {
                "success": False,
                "error": f"Deep Pattern Recognition failed: rc={proc.returncode}",
                "stderr": proc.stderr[-1000:],
                "duration_sec": dur
            }
        # Try to parse last JSON object from stdout
        stdout = proc.stdout.strip().splitlines()
        parsed = None
        for line in reversed(stdout[-20:]):
            line = line.strip()
            if line.startswith("{") and line.endswith("}"):
                try:
                    parsed = json.loads(line)
                    break
                except Exception:
                    continue
        return parsed or {"success": True, "deep_pattern_recognition_complete": True, "raw_stdout_tail": stdout[-5:], "duration_sec": dur}
    except subprocess.TimeoutExpired:
        return {"success": False, "error": "DPR timeout", "duration_sec": timeout_sec}
    except Exception as e:
        return {"success": False, "error": str(e)}


def run_log_tailer(context: Dict[str, Any] = None) -> Dict[str, Any]:
    if context is None:
        context = {}
    print("📡 Running Log Tailer...")
    try:
        reports_dir = context.get("reports_dir", DEFAULT_REPORTS_DIR)
        poll_seconds = int(context.get("poll_seconds", 0))  # 0 = single pass
        max_batch = int(context.get("max_batch", 6))
        exclude_large_mb = float(context.get("exclude_large_mb", 100.0))
        since_epoch = float(context.get("since_epoch", time.time() - 3600))  # default: last hour

        start_ts = time.time()
        total_files_processed = 0
        last_epoch = since_epoch
        dpr_runs = []

        def single_pass() -> Tuple[int, Optional[Dict[str, Any]]]:
            files = list_recent_reports(reports_dir, last_epoch, max_files=max_batch, exclude_large_mb=exclude_large_mb)
            return len(files), run_deep_pattern_recognition_for(files)

        if poll_seconds <= 0:
            count, dpr_result = single_pass()
            total_files_processed += count
            if dpr_result:
                dpr_runs.append({"files_processed": count, "result": dpr_result})
        else:
            end_time = start_ts + poll_seconds
            while time.time() < end_time:
                count, dpr_result = single_pass()
                total_files_processed += count
                if dpr_result:
                    dpr_runs.append({"files_processed": count, "result": dpr_result})
                last_epoch = time.time()
                time.sleep(min(5, max(1, poll_seconds // 10)))

        summary = {
            "success": True,
            "log_tailer_complete": True,
            "reports_dir": reports_dir,
            "total_files_processed": total_files_processed,
            "dpr_runs": dpr_runs,
            "started_at": datetime.fromtimestamp(start_ts).isoformat(),
            "ended_at": datetime.now().isoformat()
        }
        # Save report
        Path("reports").mkdir(exist_ok=True)
        out_path = f"reports/log_tailer_{int(time.time())}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        print(f"📄 Log tailer report saved: {out_path}")
        return summary
    except Exception as e:
        err = {"success": False, "error": f"Log tailer failed: {e}", "traceback": traceback.format_exc()}
        print(f"❌ {err['error']}")
        return err

if __name__ == "__main__":
    result = run_log_tailer()
    print(json.dumps(result, indent=2))
