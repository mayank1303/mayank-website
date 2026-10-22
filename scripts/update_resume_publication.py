"""Add the accepted ICTAI paper while preserving the existing resume pages."""
from copy import deepcopy
from io import BytesIO
from pathlib import Path

from pypdf import PdfReader, PdfWriter, PageObject, Transformation
from pypdf.annotations import Link
from pypdf.generic import NameObject, RectangleObject
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "public/Mayank_Kumar_Resume.pdf"
SOURCE = ROOT / "tmp/pdfs/resume-original.pdf"
URL = "https://drive.google.com/file/d/1ibSh-nSV5Y5Bf8ZpNhkbnBAl4hrMQMUY/view?usp=drivesdk"


def main():
    SOURCE.parent.mkdir(parents=True, exist_ok=True)
    if not SOURCE.exists():
        if "ICTAI 2026" in PdfReader(TARGET).pages[1].extract_text():
            print("The accepted ICTAI paper is already in the resume.")
            return
        SOURCE.write_bytes(TARGET.read_bytes())
    reader = PdfReader(SOURCE)
    writer = PdfWriter()
    writer.add_page(reader.pages[0])
    original = reader.pages[1]
    width, height = float(original.mediabox.width), float(original.mediabox.height)
    split, shift = height - 151, 44
    page = PageObject.create_blank_page(width=width, height=height)
    upper, lower = deepcopy(original), deepcopy(original)
    for part in (upper, lower):
        part.pop(NameObject("/Annots"), None)
    upper.cropbox = RectangleObject((0, split, width, height))
    lower.cropbox = RectangleObject((0, 0, width, split))
    page.merge_page(upper)
    page.merge_transformed_page(lower, Transformation().translate(ty=-shift))

    buffer = BytesIO()
    overlay = canvas.Canvas(buffer, pagesize=(width, height))
    style = ParagraphStyle("publication", fontName="Times-Roman", fontSize=9, leading=11)
    paragraph = Paragraph(
        '<b>Conference:</b> Evaluating the Robustness of Modern Malware Classifiers '
        'Under Label-Flipping Data Poisoning Attacks '
        '(Full paper accepted at ICTAI 2026; Paper 913). '
        f'<a href="{URL}" color="#2547D0"><u>Acceptance notification</u></a>',
        style,
    )
    _, text_height = paragraph.wrap(width - 73, 40)
    assert text_height <= 33, "Publication no longer fits its reserved space"
    paragraph.drawOn(overlay, 38.821, height - 154 - text_height)
    overlay.save()
    added = PdfReader(buffer).pages[0]
    page.merge_page(added)
    writer.add_page(page)

    # Preserve the original clickable links, moving any links below the insertion.
    for reference in original.get("/Annots", []):
        annotation = reference.get_object()
        action = annotation.get("/A", {})
        if action.get("/URI"):
            rect = list(map(float, annotation["/Rect"]))
            if rect[3] < split:
                rect[1] -= shift
                rect[3] -= shift
            writer.add_annotation(1, Link(rect=rect, url=str(action["/URI"])))
    writer.add_metadata({"/Title": "Mayank Kumar - Resume", "/Author": "Mayank Kumar"})
    writer.write(TARGET)
    check = PdfReader(TARGET)
    assert len(check.pages) == len(reader.pages) == 2
    text = check.pages[1].extract_text()
    assert "ICTAI 2026" in text and "Acceptance notification" in text
    urls = [a.get_object().get("/A", {}).get("/URI") for a in check.pages[1].get("/Annots", [])]
    assert URL in urls
    for line in reader.pages[1].extract_text().splitlines():
        assert line in text, f"Existing resume text lost: {line}"
    print("Updated 2-page resume; original text and publication links preserved.")


if __name__ == "__main__":
    main()
