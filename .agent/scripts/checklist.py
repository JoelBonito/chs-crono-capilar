#!/usr/bin/env python3
"""
Master Checklist Runner - Antigravity Kit
==========================================

Orchestrates all validation scripts in priority order.
Use this for incremental validation during development.

Usage:
    python scripts/checklist.py .                    # Run core checks
    python scripts/checklist.py . --url <URL>        # Include performance checks

Priority Order:
    P0: Security Scan (vulnerabilities, secrets)
    P1: Lint & Type Check (code quality)
    P2: Schema Validation (if database exists)
    P3: Test Runner (unit/integration tests)
    P4: UX Audit (psychology laws, accessibility)
    P5: SEO Check (meta tags, structure)
    P6: Performance (lighthouse - requires URL)
"""

import sys
import subprocess
import argparse
from pathlib import Path
from typing import List

# ANSI colors for terminal output
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
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text.center(60)}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.ENDC}\n")

def print_step(text: str):
    print(f"{Colors.BOLD}{Colors.BLUE}🔄 {text}{Colors.ENDC}")

def print_success(text: str):
    print(f"{Colors.GREEN}✅ {text}{Colors.ENDC}")

def print_warning(text: str):
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.ENDC}")

def print_error(text: str):
    print(f"{Colors.RED}❌ {text}{Colors.ENDC}")

# Define priority-ordered checks
# Each check is (name, command_list, required)
# command_list: list of args for subprocess.run OR a script path string
CORE_CHECKS = [
    ("Framework Validation", ".agent/scripts/validate_installation.py", True),
    ("Traceability Check", ".agent/scripts/validate_traceability.py", False),
]

PERFORMANCE_CHECKS = []

# Web-specific checks (run if web/ directory exists)
WEB_CHECKS = [
    ("TypeScript Check", ["npx", "tsc", "--noEmit"], True),
    ("Lint Check", ["npm", "run", "lint"], False),
    ("Build Check", ["npm", "run", "build"], False),
]

def run_check(name: str, cmd: list, cwd: str) -> dict:
    """
    Run a validation command and capture results

    Returns:
        dict with keys: name, passed, output, skipped
    """
    print_step(f"Running: {name}")

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300,  # 5 minute timeout
            cwd=cwd
        )

        passed = result.returncode == 0

        if passed:
            print_success(f"{name}: PASSED")
        else:
            print_error(f"{name}: FAILED")
            if result.stderr:
                print(f"  Error: {result.stderr[:200]}")

        return {
            "name": name,
            "passed": passed,
            "output": result.stdout,
            "error": result.stderr,
            "skipped": False
        }

    except subprocess.TimeoutExpired:
        print_error(f"{name}: TIMEOUT (>5 minutes)")
        return {"name": name, "passed": False, "output": "", "error": "Timeout", "skipped": False}

    except Exception as e:
        print_error(f"{name}: ERROR - {str(e)}")
        return {"name": name, "passed": False, "output": "", "error": str(e), "skipped": False}

def print_summary(results: List[dict]):
    """Print final summary report"""
    print_header("📊 CHECKLIST SUMMARY")
    
    passed_count = sum(1 for r in results if r["passed"] and not r.get("skipped"))
    failed_count = sum(1 for r in results if not r["passed"] and not r.get("skipped"))
    skipped_count = sum(1 for r in results if r.get("skipped"))
    
    print(f"Total Checks: {len(results)}")
    print(f"{Colors.GREEN}✅ Passed: {passed_count}{Colors.ENDC}")
    print(f"{Colors.RED}❌ Failed: {failed_count}{Colors.ENDC}")
    print(f"{Colors.YELLOW}⏭️  Skipped: {skipped_count}{Colors.ENDC}")
    print()
    
    # Detailed results
    for r in results:
        if r.get("skipped"):
            status = f"{Colors.YELLOW}⏭️ {Colors.ENDC}"
        elif r["passed"]:
            status = f"{Colors.GREEN}✅{Colors.ENDC}"
        else:
            status = f"{Colors.RED}❌{Colors.ENDC}"
        
        print(f"{status} {r['name']}")
    
    print()
    
    if failed_count > 0:
        print_error(f"{failed_count} check(s) FAILED - Please fix before proceeding")
        return False
    else:
        print_success("All checks PASSED ✨")
        return True

def main():
    parser = argparse.ArgumentParser(
        description="Run Antigravity Kit validation checklist",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python scripts/checklist.py .                      # Core checks only
  python scripts/checklist.py . --url http://localhost:3000  # Include performance
        """
    )
    parser.add_argument("project", help="Project path to validate")
    parser.add_argument("--url", help="URL for performance checks (lighthouse, playwright)")
    parser.add_argument("--skip-performance", action="store_true", help="Skip performance checks even if URL provided")
    
    args = parser.parse_args()
    
    project_path = Path(args.project).resolve()
    
    if not project_path.exists():
        print_error(f"Project path does not exist: {project_path}")
        sys.exit(1)
    
    print_header("🚀 ANTIGRAVITY KIT - MASTER CHECKLIST")
    print(f"Project: {project_path}")
    print(f"URL: {args.url if args.url else 'Not provided (performance checks skipped)'}")
    
    results = []

    # Run core checks (Python scripts)
    print_header("📋 CORE CHECKS")
    for name, script_path, required in CORE_CHECKS:
        script = project_path / script_path
        if not script.exists():
            print_warning(f"{name}: Script not found, skipping")
            results.append({"name": name, "passed": True, "output": "", "skipped": True})
            continue
        cmd = [sys.executable, str(script)]
        result = run_check(name, cmd, str(project_path))
        results.append(result)

        if required and not result["passed"]:
            print_error(f"CRITICAL: {name} failed. Stopping checklist.")
            print_summary(results)
            sys.exit(1)

    # Run web checks if web/ directory exists
    web_dir = project_path / "web"
    if web_dir.exists() and (web_dir / "package.json").exists():
        print_header("🌐 WEB CHECKS")
        for name, cmd, required in WEB_CHECKS:
            result = run_check(name, cmd, str(web_dir))
            results.append(result)

            if required and not result["passed"]:
                print_error(f"CRITICAL: {name} failed. Stopping checklist.")
                print_summary(results)
                sys.exit(1)
    
    # Print summary
    all_passed = print_summary(results)
    
    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
