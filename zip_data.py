import zipfile
import os

print("Starting to zip the data folder...")
with zipfile.ZipFile("data.zip", "w", zipfile.ZIP_STORED) as zipf:
    for root, _, files in os.walk("data"):
        for file in files:
            file_path = os.path.join(root, file)
            # Store it inside a 'data' folder in the zip, so it acts identically
            arcname = os.path.join("data", os.path.relpath(file_path, "data"))
            zipf.write(file_path, arcname)
print("Finished zipping data.zip!")
