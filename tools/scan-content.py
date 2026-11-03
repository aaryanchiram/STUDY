#!/usr/bin/env python3
"""Scan content folders and rebuild the website content index."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
OUT = ROOT / "assets" / "data" / "content-index.json"
SUBJECTS = {"CDP":"बाल विकास एवं शिक्षाशास्त्र","Hindi":"हिंदी","Sanskrit":"संस्कृत","Social_Science":"सामाजिक विज्ञान","Common":"सामान्य"}
EXT_TYPES = {".pdf":"PDF", ".md":"Notes", ".txt":"Notes"}
def main():
    items=[]
    for subject_dir in sorted(CONTENT.iterdir()):
        if not subject_dir.is_dir(): continue
        for path in sorted(subject_dir.rglob("*")):
            if not path.is_file() or path.name.lower()=="readme.md": continue
            typ=EXT_TYPES.get(path.suffix.lower())
            if not typ: continue
            rel=path.relative_to(ROOT).as_posix()
            title=path.stem.replace("_"," ").replace("-"," ").strip()
            items.append({"id":rel.lower().replace("/","-").replace(".","-"),"title":title,"subject":subject_dir.name,"type":typ,"description":f"{SUBJECTS.get(subject_dir.name,subject_dir.name)} की अध्ययन सामग्री","keywords":[title,subject_dir.name],"url":rel,"file":rel})
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps({"version":1,"items":items},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"इंडेक्स अपडेट: {len(items)} सामग्री -> {OUT.relative_to(ROOT)}")
if __name__=="__main__": main()
