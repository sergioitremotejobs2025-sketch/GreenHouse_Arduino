import os
import time
import markdown
from playwright.sync_api import sync_playwright

def export_to_pdf():
    input_file = os.path.abspath("HojaDeProcesos_Pieza1.md")
    output_html = os.path.abspath("print_temp.html")
    output_pdf = os.path.abspath("HojaDeProcesos_Pieza1.pdf")
    
    # Read markdown
    with open(input_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Convert to HTML
    # We enable tables and extra extensions
    html_body = markdown.markdown(content, extensions=['tables', 'extra'])
    
    full_html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="utf-8">
        <style>
            @page {{
                size: A4;
                margin: 8mm;
            }}
            body {{
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                font-size: 10px;
                color: #000;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
                table-layout: fixed;
                border: 1px solid black;
            }}
            th, td {{
                border: 1px solid black;
                padding: 4px;
                text-align: left;
                vertical-align: middle;
                overflow: hidden;
            }}
            th {{
                background-color: #f2f2f2;
                font-weight: bold;
            }}
            img {{
                display: block;
                margin: 0 auto;
                max-width: 100%;
                height: auto;
            }}
            .header-table td {{
                border: 1.5px solid black;
            }}
            .header-blueprint {{
                max-width: 650px !important;
                width: 100% !important;
            }}
            /* Specific width for ops table columns */
            table:nth-of-type(2) col:nth-child(1) {{ width: 5%; }}
            table:nth-of-type(2) col:nth-child(2) {{ width: 18%; }}
            table:nth-of-type(2) col:nth-child(3) {{ width: 14%; }}
            table:nth-of-type(2) col:nth-child(4) {{ width: 7%; }}
            table:nth-of-type(2) col:nth-child(5) {{ width: 7%; }}
            table:nth-of-type(2) col:nth-child(6) {{ width: 7%; }}
            table:nth-of-type(2) col:nth-child(7) {{ width: 5%; }}
            table:nth-of-type(2) col:nth-child(8) {{ width: 25%; }}
            table:nth-of-type(2) col:nth-child(9) {{ width: 12%; }}
            
            /* Ensure croquis images are visible but sized right */
            td img {{
                max-height: 60px;
                object-fit: contain;
            }}
            
            /* Remove header info from markdown rendering if it appears as pre/code */
            pre, code {{
                background: transparent !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                font-family: inherit !important;
                font-size: inherit !important;
                white-space: normal !important;
            }}
        </style>
    </head>
    <body>
        {html_body}
    </body>
    </html>
    """

    with open(output_html, "w", encoding="utf-8") as f:
        f.write(full_html)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        # Navigate using correct file URL format
        page.goto(f"file://{output_html}")
        # Wait for all base64 and linked images
        page.wait_for_load_state("networkidle")
        time.sleep(3) 
        page.pdf(path=output_pdf, format="A4", print_background=True)
        browser.close()
    
    print(f"PDF successfully generated at: {output_pdf}")

if __name__ == "__main__":
    export_to_pdf()
