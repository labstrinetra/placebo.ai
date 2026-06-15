from markdown_pdf import MarkdownPdf, Section

def convert_md_to_pdf():
    print("Converting PITCH_DECK.md to PITCH_DECK.pdf...")
    pdf = MarkdownPdf(toc_level=2)
    with open("PITCH_DECK.md", "r", encoding="utf-8") as f:
        md_content = f.read()
    
    pdf.add_section(Section(md_content))
    pdf.save("PITCH_DECK.pdf")
    print("Successfully created PITCH_DECK.pdf!")

if __name__ == "__main__":
    convert_md_to_pdf()
