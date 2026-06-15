import subprocess
import sys
import os
import time

def run_script(script_name):
    print(f"\n{'='*60}")
    print(f"🚀 EXECUTING: {script_name}")
    print(f"{'='*60}\n")
    
    script_path = os.path.join(os.path.dirname(__file__), script_name)
    
    try:
        # Run the script and stream the output to the console
        result = subprocess.run([sys.executable, script_path], check=True)
        print(f"\n✅ {script_name} completed successfully.\n")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ {script_name} failed with exit code {e.returncode}.\n")
        print("⚠️ Halting test suite due to failure.")
        sys.exit(1)

def main():
    print("="*60)
    print("   PLACEBO AI - MASTER VALIDATION SUITE EXECUTOR")
    print("="*60)
    
    scripts = [
        "01_test_environment.py",
        "02_test_auth_flow.py",
        "03_test_credit_economy.py",
        "04_test_load_stress.py",
        "05_test_hallucinations.py"
    ]
    
    for script in scripts:
        run_script(script)
        time.sleep(2) # Brief pause between tests
        
    print("="*60)
    print("🎉 ALL VALIDATION PHASES COMPLETED SUCCESSFULLY! 🎉")
    print("="*60)

if __name__ == "__main__":
    main()
