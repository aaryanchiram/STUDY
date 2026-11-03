#!/usr/bin/env python3
"""Automatically rebuild the CTET Digital Library index from content folders."""
import json
import re
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
OUT = ROOT / "assets" / "data" / "content-index.json"
SUBJECTS = {
    "CDP": "बाल विकास एवं शिक्षाशास्त्र",
    "Hindi": "हिंदी",
    "Sanskrit": "संस्कृत",
    "Social_Science": "सामाजिक विज्ञान",
    "Common": "सामान्य",
}
EXT_TYPES = {
    ".html": "HTML",
    
    ".pdf": "PDF",
    
}

def page_metadata(path: Path):
    if path.suffix.lower() not in {".html", ".htm"}:
        return "", ""
    try:
        raw = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return "", ""
    title = re.search(r"<title[^>]*>(.*?)</title>", raw, re.I | re.S)
    desc = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']', raw, re.I | re.S)
    clean = lambda value: re.sub(r"\\s+", " ", unescape(re.sub(r"<[^>]+>", "", value or ""))).strip()
    return clean(title.group(1)) if title else "", clean(desc.group(1)) if desc else ""

def main():
    previous = {}
    if OUT.exists():
        try:
            old = json.loads(OUT.read_text(encoding="utf-8"))
            for item in old.get("items", []):
                if item.get("url"):
                    previous[item["url"]] = item
        except (json.JSONDecodeError, AttributeError):
            pass

    discovered = []
    if CONTENT.exists():
        for subject_dir in sorted(CONTENT.iterdir()):
            if not subject_dir.is_dir():
                continue
            for path in sorted(subject_dir.rglob("*")):
                if not path.is_file():
                    continue
                typ = EXT_TYPES.get(path.suffix.lower())
                if not typ:
                    continue
                rel = path.relative_to(ROOT).as_posix()
                old = previous.get(rel, {})
                title, description = page_metadata(path)
                title = old.get("title") or title or path.stem.replace("_", " ").replace("-", " ").strip()
                description = old.get("description") or description or f"{SUBJECTS.get(subject_dir.name, subject_dir.name)} की अध्ययन सामग्री"
                keywords = old.get("keywords") or [title, SUBJECTS.get(subject_dir.name, subject_dir.name), "CTET"]
                discovered.append({
                    "id": old.get("id") or rel.lower().replace("/", "-").replace(".", "-"),
                    "title": title,
                    "subject": subject_dir.name,
                    "type": typ,
                    "description": description,
                    "keywords": keywords,
                    "url": rel,
                    "file": rel,
                })


    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        "version": 2,
        "generated": __import__("datetime").date.today().isoformat(),
        "items": discovered,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"इंडेक्स अपडेट: {len(discovered)} सामग्री")

if __name__ == "__main__":
    main()
