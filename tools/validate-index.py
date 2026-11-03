#!/usr/bin/env python3
"""Validate content-index.json before publishing."""
import json, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/"assets/data/content-index.json"
data=json.loads(p.read_text(encoding="utf-8"))
items=data.get("items",[])
errors=[]
seen=set()
for n,item in enumerate(items,1):
    for key in ("id","title","subject","type","url"):
        if not item.get(key): errors.append(f"पंक्ति {n}: {key} खाली है")
    if item.get("id") in seen: errors.append(f"डुप्लिकेट ID: {item.get('id')}")
    seen.add(item.get("id"))
    target=item.get("file")
    if target and not (ROOT/target).exists(): errors.append(f"फाइल नहीं मिली: {target}")
if errors:
    print("\n".join(errors)); sys.exit(1)
print(f"सही इंडेक्स: {len(items)} सामग्री प्रविष्टियाँ")
