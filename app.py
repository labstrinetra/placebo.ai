import sys
import traceback

print("Starting app proxy...", flush=True)

try:
    from src.app import app
    print("Successfully imported src.app!", flush=True)
except Exception as e:
    print(f"CRITICAL IMPORT ERROR: {e}", flush=True)
    traceback.print_exc(file=sys.stdout)
    sys.stdout.flush()
    raise

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
