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
    html_body = markdown.markdown(content, extensions=['tables', 'extra'])
    
    full_html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="utf-8">
        <style>
            @page {{
                size: A4;
                margin: 6mm;
            }}
            body {{
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                font-size: 11px;
                color: #000;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 2px;
                table-layout: fixed;
                border: 1px solid black;
            }}
            th, td {{
                border: 1px solid black;
                padding: 1.5px 3px;
                text-align: left;
                vertical-align: middle;
                overflow: hidden;
                line-height: 1.12;
            }}
            th {{
                background-color: #f2f2f2;
                font-weight: bold;
                padding: 3px;
            }}
            img {{
                display: block;
                margin: 0 auto;
                max-width: 100%;
                height: auto;
            }}
            .header-blueprint {{
                max-width: 650px !important;
                width: 100% !important;
            }}
            td img {{
                max-height: 48px;
                object-fit: contain;
            }}
            pre, code {{
                background: transparent !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                font-family: inherit !important;
                white-space: normal !important;
            }}
            /* Specific adjustments for phase 1.x compacting */
            tr {{
                page-break-inside: avoid;
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
        page.goto(f"file://{output_html}")
        page.wait_for_load_state("networkidle")
        time.sleep(3) 
        page.pdf(path=output_pdf, format="A4", print_background=True)
        browser.close()
    
    print(f"PDF successfully generated at: {output_pdf}")

if __name__ == "__main__":
    export_to_pdf()
