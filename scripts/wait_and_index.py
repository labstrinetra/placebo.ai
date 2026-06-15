import psutil
import time
import subprocess
import requests
import sys

# ==========================================
# ENTER YOUR TELEGRAM CREDENTIALS HERE
# ==========================================
TELEGRAM_BOT_TOKEN = "8882061876:AAGNr8ZlDeSfUdTMmwinnRygy65WDxGn2P8"
TELEGRAM_CHAT_ID = "-5121497826"

def send_telegram_message(message):
    if TELEGRAM_BOT_TOKEN == "YOUR_BOT_TOKEN" or TELEGRAM_CHAT_ID == "YOUR_CHAT_ID":
        print("\n[!] Telegram credentials not set. Skipping Telegram notification.")
        return
    
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message
    }
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("[+] Telegram notification sent.")
        else:
            print(f"[-] Failed to send Telegram message: {response.text}")
    except Exception as e:
        print(f"[-] Error sending Telegram message: {e}")

def wait_for_process(process_name="process_mbbs_books.py"):
    print(f"[*] Monitoring system for '{process_name}'...")
    while True:
        is_running = False
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            try:
                cmdline = proc.info.get('cmdline')
                if cmdline and any(process_name in str(arg) for arg in cmdline):
                    is_running = True
                    break
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
        
        if not is_running:
            print(f"\n[+] Process '{process_name}' is no longer running. It has finished!")
            break
        
        # Print a simple spinner/dot so you know it's alive
        sys.stdout.write('.')
        sys.stdout.flush()
        time.sleep(10) # Check every 10 seconds

if __name__ == "__main__":
    print("======================================================")
    print("      AUTOMATIC INDEXING & NOTIFICATION SCRIPT        ")
    print("======================================================")
    
    # 1. Wait for process_mbbs_books.py to finish
    wait_for_process("process_mbbs_books.py")
    
    # 2. Start indexing
    print("\n[*] Starting incremental indexing script...")
    send_telegram_message("⏳ The MBBS PDF processing has finished. `index_mbbs_incremental.py` is starting now...")
    
    try:
        # We assume the script is in the same directory (d:\sample chatbot\scripts)
        subprocess.run(["python", "index_mbbs_incremental.py"], check=True)
        print("\n[+] Indexing completed successfully!")
        send_telegram_message("✅ **SUCCESS**: MBBS Incremental Indexing completed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"\n[-] Indexing failed with exit code: {e.returncode}")
        send_telegram_message(f"❌ **FAILED**: MBBS Incremental Indexing failed with error code {e.returncode}.")
    except FileNotFoundError:
        print("\n[-] Error: Could not find 'index_mbbs_incremental.py'. Make sure you are running this script from the 'scripts' folder.")
        send_telegram_message("❌ **FAILED**: Could not find `index_mbbs_incremental.py` to start the indexing.")
