import asyncio
from playwright.async_api import async_playwright
import os

BASE_URL = "http://localhost:8000"

async def test_auth_flow():
    print("--- Phase 2: Authentication & Session Flow ---")
    try:
        async with async_playwright() as p:
            # Connect to already-open Brave browser using debugging port
            browser = await p.chromium.connect_over_cdp("http://localhost:9222")
            
            # Use the default context (which has the user's login cookies/localStorage)
            context = browser.contexts[0]
            page = await context.new_page()
            await page.goto(BASE_URL)
            
            # 1. Check if user is logged in
            print("[TEST] Checking Authentication Status...")
            await page.wait_for_timeout(2000)
            
            credits_text = await page.inner_text(".credit-info span")
            if "Log in" in credits_text:
                print("⚠️ You are not logged in. Please log in manually once, then run this script again.")
            else:
                print("✅ User is authenticated!")
                
            # 2. Verify LocalStorage isolation for History
            print("[TEST] Verifying Chat History Namespace Isolation...")
            local_storage = await page.evaluate("() => Object.keys(localStorage)")
            history_keys = [k for k in local_storage if k.startswith("chat_history_")]
            if len(history_keys) > 0 and "chat_history" not in history_keys:
                print(f"✅ History is properly isolated under: {history_keys[0]}")
            else:
                print("❌ History isolation failed or missing.")
            
            await browser.close()
    except Exception as e:
        print(f"❌ Auth Flow Test Failed: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_auth_flow())
