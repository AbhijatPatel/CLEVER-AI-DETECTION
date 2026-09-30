import io
from typing import Tuple, Dict, Any
from pypdf import PdfReader
from docx import Document

def extract_document_text(file_bytes: bytes, file_name: str) -> Tuple[str, Dict[str, Any]]:
    lower_name = file_name.lower()
    metadata: Dict[str, Any] = {"fileName": file_name, "pageCount": 1}
    extracted_text = ""

    if lower_name.endswith('.pdf'):
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            metadata["pageCount"] = len(reader.pages)
            if reader.metadata:
                metadata["pdfProducer"] = reader.metadata.get('/Producer', '')
                metadata["pdfCreator"] = reader.metadata.get('/Creator', '')
                metadata["creationDate"] = str(reader.metadata.get('/CreationDate', ''))
            
            pages_text = []
            for idx, page in enumerate(reader.pages):
                txt = page.extract_text() or ""
                if txt.strip():
                    pages_text.append(txt.strip())
            extracted_text = "\n\n".join(pages_text)
        except Exception as e:
            raise ValueError(f"Failed to parse PDF document: {str(e)}")

    elif lower_name.endswith('.docx'):
        try:
            doc = Document(io.BytesIO(file_bytes))
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            extracted_text = "\n\n".join(paragraphs)
            metadata["paragraphCount"] = len(paragraphs)
            if doc.core_properties:
                metadata["docxAuthor"] = doc.core_properties.author or ""
                metadata["docxLastModifiedBy"] = doc.core_properties.last_modified_by or ""
        except Exception as e:
            raise ValueError(f"Failed to parse DOCX document: {str(e)}")

    else:
        # Plain text
        try:
            extracted_text = file_bytes.decode('utf-8', errors='ignore')
        except Exception as e:
            raise ValueError(f"Failed to decode text: {str(e)}")

    if not extracted_text.strip():
        raise ValueError("Document appears to be empty or contains scanned images without OCR text.")

    return extracted_text.strip(), metadata
