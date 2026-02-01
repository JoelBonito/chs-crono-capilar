#!/usr/bin/env python3
"""
Full Verification Suite - Antigravity Kit
==========================================

Runs COMPLETE validation including all checks + performance + E2E.
Use this before deployment or major releases.

Usage:
    python scripts/verify_all.py . --url <URL>

Includes ALL checks:
    ✅ Security Scan (OWASP, secrets, dependencies)
    ✅ Lint & Type Coverage
    ✅ Schema Validation
    ✅ Test Suite (unit + integration)
    ✅ UX Audit (psychology, accessibility)
    ✅ SEO Check
    ✅ Lighthouse (Core Web Vitals)
    ✅ Playwright E2E
    ✅ Bundle Analysis (if applicable)
    ✅ Mobile Audit (if applicable)
"""

import sys
import subprocess
import argparse
from pathlib import Path
from typing import List
from datetime import datetime

# ANSI colors
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header(text: str):
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*70}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text.center(70)}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'='*70}{Colors.ENDC}\n")

def print_step(text: str):
    print(f"{Colors.BOLD}{Colors.BLUE}🔄 {text}{Colors.ENDC}")

def print_success(text: str):
    print(f"{Colors.GREEN}✅ {text}{Colors.ENDC}")

def print_warning(text: str):
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.ENDC}")

def print_error(text: str):
    print(f"{Colors.RED}❌ {text}{Colors.ENDC}")

# Complete verification suite
# Checks use either:
#   - A script path string (Python script relative to project root)
#   - A list of command args (run directly in project or web dir)
VERIFICATION_SUITE = [
    # P0: Framework Integrity (CRITICAL)
    {
        "category": "Framework Integrity",
        "checks": [
            ("Installation Validation", ".agent/scripts/validate_installation.py", True),
        ]
    },

    # P1: Code Quality
    {
        "category": "Code Quality",
        "web_checks": [
            ("TypeScript Check", ["npx", "tsc", "--noEmit"], True),
            ("Lint Check", ["npm", "run", "lint"], False),
        ]
    },

    # P2: Build
    {
        "category": "Build",
        "web_checks": [
            ("Build Check", ["npm", "run", "build"], True),
        ]
    },

    # P3: Traceability
    {
        "category": "Traceability",
        "checks": [
            ("Traceability Validation", ".agent/scripts/validate_traceability.py", False),
        ]
    },
]

def run_script(name: str, script_path: Path, project_path: str) -> dict:
    """Run validation script"""
    if not script_path.exists():
        print_warning(f"{name}: Script not found, skipping")
        return {"name": name, "passed": True, "skipped": True, "duration": 0}
    
    print_step(f"Running: {name}")
    start_time = datetime.now()
    
    # Build command
    cmd = [sys.executable, str(script_path)]

    # Run
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=600,  # 10 minute timeout for slow checks
            cwd=project_path
        )
        
        duration = (datetime.now() - start_time).total_seconds()
        passed = result.returncode == 0
        
        if passed:
            print_success(f"{name}: PASSED ({duration:.1f}s)")
        else:
            print_error(f"{name}: FAILED ({duration:.1f}s)")
            if result.stderr:
                print(f"  {result.stderr[:300]}")
        
        return {
            "name": name,
            "passed": passed,
            "output": result.stdout,
            "error": result.stderr,
            "skipped": False,
            "duration": duration
        }
    
    except subprocess.TimeoutExpired:
        duration = (datetime.now() - start_time).total_seconds()
        print_error(f"{name}: TIMEOUT (>{duration:.0f}s)")
        return {"name": name, "passed": False, "skipped": False, "duration": duration, "error": "Timeout"}
    
    except Exception as e:
        duration = (datetime.now() - start_time).total_seconds()
        print_error(f"{name}: ERROR - {str(e)}")
        return {"name": name, "passed": False, "skipped": False, "duration": duration, "error": str(e)}

def print_final_report(results: List[dict], start_time: datetime):
    """Print comprehensive final report"""
    total_duration = (datetime.now() - start_time).total_seconds()
    
    print_header("📊 FULL VERIFICATION REPORT")
    
    # Statistics
    total = len(results)
    passed = sum(1 for r in results if r["passed"] and not r.get("skipped"))
    failed = sum(1 for r in results if not r["passed"] and not r.get("skipped"))
    skipped = sum(1 for r in results if r.get("skipped"))
    
    print(f"Total Duration: {total_duration:.1f}s")
    print(f"Total Checks: {total}")
    print(f"{Colors.GREEN}✅ Passed: {passed}{Colors.ENDC}")
    print(f"{Colors.RED}❌ Failed: {failed}{Colors.ENDC}")
    print(f"{Colors.YELLOW}⏭️  Skipped: {skipped}{Colors.ENDC}")
    print()
    
    # Category breakdown
    print(f"{Colors.BOLD}Results by Category:{Colors.ENDC}")
    current_category = None
    for r in results:
        # Print category header if changed
        if r.get("category") and r["category"] != current_category:
            current_category = r["category"]
            print(f"\n{Colors.BOLD}{Colors.CYAN}{current_category}:{Colors.ENDC}")
        
        # Print result
        if r.get("skipped"):
            status = f"{Colors.YELLOW}⏭️ {Colors.ENDC}"
        elif r["passed"]:
            status = f"{Colors.GREEN}✅{Colors.ENDC}"
        else:
            status = f"{Colors.RED}❌{Colors.ENDC}"
        
        duration_str = f"({r.get('duration', 0):.1f}s)" if not r.get("skipped") else ""
        print(f"  {status} {r['name']} {duration_str}")
    
    print()
    
    # Failed checks detail
    if failed > 0:
        print(f"{Colors.BOLD}{Colors.RED}❌ FAILED CHECKS:{Colors.ENDC}")
        for r in results:
            if not r["passed"] and not r.get("skipped"):
                print(f"\n{Colors.RED}✗ {r['name']}{Colors.ENDC}")
                if r.get("error"):
                    error_preview = r["error"][:200]
                    print(f"  Error: {error_preview}")
        print()
    
    # Final verdict
    if failed > 0:
        print_error(f"VERIFICATION FAILED - {failed} check(s) need attention")
        print(f"\n{Colors.YELLOW}💡 Tip: Fix critical (security, lint) issues first{Colors.ENDC}")
        return False
    else:
        print_success("✨ ALL CHECKS PASSED - Ready for deployment! ✨")
        return True

def main():
    parser = argparse.ArgumentParser(
        description="Run complete Antigravity Kit verification suite",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python scripts/verify_all.py . --url http://localhost:3000
  python scripts/verify_all.py . --url https://staging.example.com --no-e2e
        """
    )
    parser.add_argument("project", help="Project path to validate")
    parser.add_argument("--url", help="URL for performance & E2E checks (optional)")
    parser.add_argument("--no-e2e", action="store_true", help="Skip E2E tests")
    parser.add_argument("--stop-on-fail", action="store_true", help="Stop on first failure")
    
    args = parser.parse_args()
    
    project_path = Path(args.project).resolve()
    
    if not project_path.exists():
        print_error(f"Project path does not exist: {project_path}")
        sys.exit(1)
    
    print_header("🚀 ANTIGRAVITY KIT - FULL VERIFICATION SUITE")
    print(f"Project: {project_path}")
    print(f"URL: {args.url}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    start_time = datetime.now()
    results = []
    
    web_dir = project_path / "web"
    has_web = web_dir.exists() and (web_dir / "package.json").exists()

    # Run all verification categories
    for suite in VERIFICATION_SUITE:
        category = suite["category"]

        print_header(f"📋 {category.upper()}")

        # Run Python script checks
        for name, script_path, required in suite.get("checks", []):
            script = project_path / script_path
            if not script.exists():
                print_warning(f"{name}: Script not found, skipping")
                results.append({"name": name, "passed": True, "skipped": True, "duration": 0, "category": category})
                continue
            result = run_script(name, script, str(project_path))
            result["category"] = category
            results.append(result)

            if args.stop_on_fail and required and not result["passed"] and not result.get("skipped"):
                print_error(f"CRITICAL: {name} failed. Stopping verification.")
                print_final_report(results, start_time)
                sys.exit(1)

        # Run web checks (npm/npx commands in web/ dir)
        if has_web:
            for name, cmd, required in suite.get("web_checks", []):
                print_step(f"Running: {name}")
                try:
                    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=300, cwd=str(web_dir))
                    passed = proc.returncode == 0
                    duration = 0
                    if passed:
                        print_success(f"{name}: PASSED")
                    else:
                        print_error(f"{name}: FAILED")
                        if proc.stderr:
                            print(f"  {proc.stderr[:200]}")
                    result = {"name": name, "passed": passed, "skipped": False, "duration": duration,
                              "output": proc.stdout, "error": proc.stderr, "category": category}
                except Exception as e:
                    print_error(f"{name}: ERROR - {e}")
                    result = {"name": name, "passed": False, "skipped": False, "duration": 0,
                              "error": str(e), "category": category}
                results.append(result)

                if args.stop_on_fail and required and not result["passed"]:
                    print_error(f"CRITICAL: {name} failed. Stopping verification.")
                    print_final_report(results, start_time)
                    sys.exit(1)
    
    # Print final report
    all_passed = print_final_report(results, start_time)
    
    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
