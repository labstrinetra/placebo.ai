import zipfile
import os

def zip_directories(folders, zip_filename):
    print(f"Creating {zip_filename}...")
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED, allowZip64=True) as zipf:
        for folder in folders:
            for root, dirs, files in os.walk(folder):
                for file in files:
                    file_path = os.path.join(root, file)
                    zipf.write(file_path, arcname=file_path)
    print("Done!")

if __name__ == "__main__":
    folders_to_zip = ['src', 'db', 'data']
    zip_directories(folders_to_zip, 'archive.zip')
