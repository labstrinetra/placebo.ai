import asyncio
import time
import requests
import aiohttp

BASE_URL = "http://localhost:8000"
# NOTE: You MUST provide a valid JWT token here if your API is secured.
# If testing without Auth, ensure the backend route allows it.
TEST_JWT_TOKEN = "your_test_jwt_token_here" 

async def fetch_chat(session, prompt):
    headers = {"Authorization": f"Bearer {TEST_JWT_TOKEN}"}
    payload = {"message": prompt, "role": "MBBS Student/Doctor", "history": []}
    
    start_time = time.time()
    try:
        # Note: Streaming responses make latency calculation complex. 
        # We are just measuring Time-to-First-Token/Connection.
        async with session.post(f"{BASE_URL}/chat", json=payload, headers=headers) as response:
            latency = time.time() - start_time
            return response.status, latency
    except Exception as e:
        return 500, time.time() - start_time

async def test_load_stress():
    print("--- Phase 4: Load & Stress Testing ---")
    prompts = ["What is Aspirin?", "Define Appendicitis", "Mechanism of Metformin", "Explain Hypertension"]
    
    print(f"[TEST] Firing {len(prompts)} concurrent requests to stress Test VRAM...")
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_chat(session, p) for p in prompts]
        results = await asyncio.gather(*tasks)
        
        for i, (status, latency) in enumerate(results):
            print(f"Request {i+1}: Status {status} | Latency: {latency:.2f}s")
            
        success_rate = sum(1 for status, _ in results if status == 200) / len(results) * 100
        print(f"--- Load Test Completed ---")
        print(f"Success Rate: {success_rate}%")
        
if __name__ == "__main__":
    asyncio.run(test_load_stress())
