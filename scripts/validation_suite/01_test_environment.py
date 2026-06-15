import requests
import sys

BASE_URL = "http://localhost:8000"

def test_environment():
    print("--- Phase 1: Environment & Config Verification ---")
    try:
        # 1. Check FastAPI Backend
        print("[TEST] Pinging FastAPI Backend...")
        res = requests.get(f"{BASE_URL}/about")
        if res.status_code == 200:
            print("✅ FastAPI is running.")
        else:
            print(f"❌ FastAPI Error: Status {res.status_code}")
            
        # 2. Check Config Endpoint (Validates .env loading)
        print("[TEST] Fetching Configuration...")
        res = requests.get(f"{BASE_URL}/config")
        config = res.json()
        if "pogsfhuwkfmmomphward" in config.get("supabase_url", ""):
            print("✅ Supabase URL correctly loaded.")
        else:
            print("❌ Invalid Supabase URL loaded.")
            
        if config.get("supabase_anon_key").startswith("eyJhbGciOi"):
            print("✅ Valid Supabase JWT Anon Key loaded.")
        else:
            print("❌ Invalid Supabase Anon Key detected.")
            
    except Exception as e:
        print(f"❌ Environment Test Failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    test_environment()
