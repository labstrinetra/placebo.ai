import asyncio
from playwright.async_api import async_playwright
import os

BASE_URL = "http://localhost:8000"

async def test_credit_economy():
    print("--- Phase 3: Credit Economy & Token Validation ---")
    try:
        async with async_playwright() as p:
            # Connect to already-open Brave browser using debugging port
            browser = await p.chromium.connect_over_cdp("http://localhost:9222")
            
            # Use the default context (which has the user's login cookies/localStorage)
            context = browser.contexts[0]
            page = await context.new_page()
            await page.goto(BASE_URL)
            
            await page.wait_for_timeout(3000)
            credits_text = await page.inner_text(".credit-info span")
            
            if "Log in" in credits_text:
                print("❌ Cannot test credits. User is not logged in.")
                await browser.close()
                return

            print(f"[TEST] Initial Credits: {credits_text}")
            
            # Fire a query to force deduction
            print("[TEST] Firing test clinical query to trigger deduction...")
            await page.fill("#chat-input", "What is Paracetamol?")
            await page.click("#send-btn")
            
            print("[WAIT] Waiting 5 seconds for UI Optimistic deduction to process...")
            await page.wait_for_timeout(5000)
            
            new_credits_text = await page.inner_text(".credit-info span")
            print(f"[TEST] Updated Credits: {new_credits_text}")
            
            if new_credits_text != credits_text:
                print("✅ Token Deduction logic SUCCESSFUL.")
            else:
                print("❌ Token Deduction logic FAILED (Credits did not update).")
                
            await browser.close()
    except Exception as e:
        print(f"❌ Credit Economy Test Failed: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_credit_economy())
