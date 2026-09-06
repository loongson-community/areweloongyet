#!/usr/bin/env python3
"""
TWiL Newsletter Content Analyzer
==================================

Parses all issues of 《每周一龙》(This Week in LoongArch) and produces structured
JSON with per-item metrics: word/sentence counts, link placement on verbs, tense
patterns, editorial commentary detection, and science communication depth.

Quick start
-----------

.. code:: bash

   python scripts/analyze-newsletter.py --summary          # top-level stats
   python scripts/analyze-newsletter.py --verb-stats       # link-on-verb patterns
   python scripts/analyze-newsletter.py --by-year          # year-over-year trends
   python scripts/analyze-newsletter.py --samples editorial  # editorial items
   python scripts/analyze-newsletter.py --samples detailed   # items with deep explanation
   python scripts/analyze-newsletter.py > analysis.json    # full JSON dump

LLM prompt for reproducing the full analysis report
---------------------------------------------------

The following prompt can be given to an LLM that has access to this script.
It reproduces the four-part report on brevity, sentence construction, commentary,
and science communication.

.. code-block:: text

   I want you to analyze the TWiL newsletter content style. Run these
   commands in order and compile the results into a single report:

   1. Run: python scripts/analyze-newsletter.py --summary
      Use this for: overall word/sentence averages, items-per-issue
      distribution, editorial rate, explanation depth distribution.

   2. Run: python scripts/analyze-newsletter.py --verb-stats
      Use this for: total links, links-on-verb percentage, top-20 link
      verbs showing the dominant sentence-construction pattern.

   3. Run: python scripts/analyze-newsletter.py --by-year
      Use this for: trend of word count, sentence count, editorial rate,
      and explanation rate across 2023, 2024, 2025.

   4. Run: python scripts/analyze-newsletter.py --samples editorial
      Use this for: qualitative examples of what triggers editorial
      commentary (thanking, correcting, historical context, speculation,
      code-quality judgment).

   5. Run: python scripts/analyze-newsletter.py --samples detailed
      Use this for: examples of items that receive in-depth scientific
      explanation — what topics are explained and in how much detail.

   6. Run: python scripts/analyze-newsletter.py --samples moderate
      Use this for: contrast — examples of items that receive only
      a moderate amount of explanation vs. detailed ones.

   7. Run the full JSON dump once with:
      python scripts/analyze-newsletter.py > /tmp/analysis.json
      Then write a small Python snippet to compute:
      - word-count bucket distribution (1-20, 21-40, 41-60, 61-80, 81-100,
        101-150, 151-200, 200+)
      - sentence-count distribution (1, 2, 3, ..., 10+)
      - items-per-issue min/max/mean/median/stdev

   Then synthesize the findings under these four headings:

   - Brevity: avg words, avg sentences, distribution buckets, trend over time.
   - Sentence construction: dominant template (Name [verb+了](url) object),
     link-on-verb percentage, top verbs, tense pattern (past-completed with 了),
     bullet vs. paragraph style.
   - Commentary: what percentage of items have editorial voice, what triggers
     it (gratitude, corrections, historical reflection, speculation, code
     quality), role of :::info blocks (deep dives, history, corrections,
     主编点评).
   - Science communication: explanation depth distribution, topics that
     receive detailed explanation (kernel internals, ABI design, compiler
     optimizations, ISA design) vs. topics left un-explained (routine fixes,
     distro news, most LLVM patches), year-over-year trend, explanation
     structure (fact → why → impact).

Interpreting the output fields
------------------------------

Each item in the full JSON has these keys:

=============== =============================================================
Key             Meaning
=============== =============================================================
issue           Issue number extracted from slug or filename
date            Publication date from frontmatter
section         Breadcrumb path of heading hierarchy (``>``-separated)
text            Full text of the news item
type            ``paragraph``, ``bullet``, or ``commentary``
word_count      CJK characters + space-delimited non-CJK tokens
sentence_count  Count of ``。！？`` terminators (minimum 1)
link_count      Inline ``[text](url)`` links in the item
links_on_verb   How many links have their display text on a Chinese verb
links           List of ``{text, url, on_verb}`` dicts
has_explanation Whether the item explains *why* or *how*
explanation_depth ``none``, ``slight``, ``moderate``, or ``detailed``
is_editorial    Whether the item contains editorial-marker keywords
is_bullet       Whether the item originated from a Markdown list
=============== =============================================================

Classification methodology
--------------------------

**Explanation depth** is scored by counting regex matches against seven
categories of "why/how" discourse markers (cause, consequence, purpose,
contrast, temporal, definition, modality). Thresholds: 0 → none, 1 →
slight, 2-3 → moderate, 4+ → detailed.

**Editorial detection** uses a keyword list: 笔者认为, 道歉, 吐槽,
无可厚非, 感谢, 辛苦了, 期待, etc.

**Verb-on-link detection** checks whether a link's display text matches a
regex of common Chinese action verbs with the ``了`` completive suffix.

**Boilerplate filtering** removes recurring structural text (section
introductions, submission instructions, greeting lines, TODO placeholders)
so they are not counted as news items.

Caveats
-------

- Sentence counting treats every ``。！？`` as a sentence boundary; run-on
  sentences with only commas are counted as 1.
- Word counting treats each CJK character as 1 word plus each space-delimited
  non-CJK token as 1 word. This is a rough heuristic; Chinese "words" are
  often 1-2 characters.
- Explanation depth is a heuristic; a score of 4+ does not guarantee the
  explanation is *correct* or *complete*, only that it contains many
  explanatory discourse markers.
- The script excludes ``template.md``, the ``announcing-a-lesser-loong``
  meta-announcement, and ``in-depth-statx`` (a standalone deep dive, not
  a numbered issue).
"""

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
NEWSLETTER_DIR = REPO_ROOT / "newsletter"

BOILERPLATE_PATTERNS = [
    r"^每周.*为大家报道.*新鲜资讯",
    r"^上周的进展主要有",
    r"^详情点进来看",
    r"^因为笔者近期现实生活繁忙",
    r"^如无特别说明.*北京时间",
    r"^本栏目的内容具有一定延续性",
    r"^本栏目接受任何网友的投稿",
    r"^本栏目目前可供张贴公益性质",
    r"^您可在 GitHub",
    r"^本周报.*接受网友投稿",
    r"^欢迎来上游坐坐",
    r"^由志愿者们自发编撰",
    r"^每个周一都",
    r"^感谢.*提供新闻线索",
    r"^本期的大多数.*新闻都是",
    r"^.*让我们感谢",
    r"^除夕快乐",
    r"^近半年的进展实在太多",
    r"^《咱龙了吗》贡献者们向您",
    r"^TODO",
    r"^如果本期没有要闻",
    r"^如有大块内容需要报道",
    r"^如果没有发行版新闻",
]

EDITORIAL_KW = [
    "笔者认为", "我们认为", "吐槽", "无可厚非", "道歉", "歉意",
    "在此谨", "放眼未来", "希望", "感谢", "辛苦了", "恭喜",
    "期待", "值得", "遗憾的是", "所幸",
]

EXPLANATION_PATTERNS = [
    r"(?:因为|由于|这是因为|原因是|具体来说|即|换言之|也就是说|例如)",
    r"(?:这样做|这意味着|这会导致|其作用|其目的是)",
    r"(?:用于|以实现|来达到|从而|进而|以便)",
    r"(?:相比之下|与.*不同|而非|而不是)",
    r"(?:先前|此前|过去|原本|现在|之后|随后)",
    r"(?:是一种|指的是|对应|等同于|相当于)",
    r"(?:需要|要求|必须|应该|可以|能够|会)",
]

VERB_PATTERN = re.compile(
    r"[\u4e00-\u9fff]*(?:了|发出|增加|修复|合并|提交|实现|发布|"
    r"支持|适配|优化|重构|移除|标记|允许|编写|翻新|避免|禁用|"
    r"采纳|切换|启用|跳过|教会|发现|意图|给出|迭代)"
)

SKIP_FILES = {"template.md"}


def is_boilerplate(text: str) -> bool:
    text = text.strip()
    if not text:
        return True
    for pat in BOILERPLATE_PATTERNS:
        if re.match(pat, text):
            return True
    return False


def parse_frontmatter(content: str) -> tuple[dict, str]:
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    if not match:
        return {}, content
    fm_text = match.group(1)
    body = content[match.end():]
    meta = {}
    for line in fm_text.split("\n"):
        m = re.match(r"(\w+):\s*(.*)", line)
        if m:
            key = m.group(1)
            val = m.group(2).strip()
            if val.startswith("[") and val.endswith("]"):
                val = val[1:-1].strip()
            meta[key] = val
    return meta, body


def extract_issue_number(meta: dict, filename: str) -> int:
    if "slug" in meta:
        m = re.search(r"(\d+)", meta["slug"])
        if m:
            return int(m.group(1))
    m = re.search(r"(\d+)", filename)
    if m:
        return int(m.group(1))
    return 0


def count_sentences(text: str) -> int:
    text = text.strip()
    if not text:
        return 0
    count = len(re.findall(r"[。！？]", text))
    if count == 0:
        count = len(re.findall(r"[.!?]+(?:\s|$)", text))
    return max(count, 1) if text else 0


def count_words(text: str) -> int:
    text = text.strip()
    if not text:
        return 0
    cjk_chars = len(re.findall(r"[\u4e00-\u9fff\u3400-\u4dbf]", text))
    non_cjk = re.sub(r"[\u4e00-\u9fff\u3400-\u4dbf]", " ", text)
    non_cjk_words = len(non_cjk.split())
    return cjk_chars + non_cjk_words


def count_links(text: str) -> int:
    inline = len(re.findall(r"\[([^\]]*)\]\(([^)]+)\)", text))
    refs = len(re.findall(r"\[([^\]]*)\]\[([^\]]*)\]", text))
    return inline + refs


def extract_link_positions(text: str) -> list:
    links = []
    for m in re.finditer(r"\[([^\]]*)\]\(([^)]+)\)", text):
        link_text = m.group(1)
        url = m.group(2)
        has_verb = bool(VERB_PATTERN.search(link_text))
        links.append({
            "text": link_text,
            "url": url,
            "on_verb": has_verb,
        })
    return links


def extract_commentary_blocks(content: str) -> list:
    blocks = []
    pattern = r":::(info|note|tip|warning|danger|caution)\[([^\]]*)\]\s*\n(.*?)\n\s*:::"
    for m in re.finditer(pattern, content, re.DOTALL):
        blocks.append({
            "type": m.group(1),
            "title": m.group(2),
            "content": m.group(3).strip(),
            "start": m.start(),
        })
    return blocks


def has_tech_explanation(text: str) -> tuple[bool, str]:
    score = 0
    for pat in EXPLANATION_PATTERNS:
        score += len(re.findall(pat, text))
    if score >= 4:
        return True, "detailed"
    elif score >= 2:
        return True, "moderate"
    elif score >= 1:
        return True, "slight"
    return False, "none"


def parse_newsletter(filepath: Path) -> dict:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    meta, body = parse_frontmatter(content)
    issue_num = extract_issue_number(meta, filepath.name)
    commentary_blocks = extract_commentary_blocks(body)

    clean_body = body
    clean_body = re.sub(r"\{/\*\s*truncate\s*\*/\}", "", clean_body)

    lines = clean_body.split("\n")
    heading_stack = []
    items = []
    current_item_lines = []
    in_code_block = False

    for line in lines:
        if not line.strip():
            if current_item_lines:
                it = "\n".join(current_item_lines).strip()
                if it and not is_boilerplate(it):
                    items.append({
                        "section": " > ".join(heading_stack) if heading_stack else "root",
                        "text": it,
                        "type": "paragraph",
                    })
                current_item_lines = []
            continue

        if line.strip().startswith("```"):
            in_code_block = not in_code_block
            continue
        if in_code_block:
            continue

        if re.match(r"^\s*</?(details|summary)>", line):
            continue

        hm = re.match(r"^(#{1,6})\s+(.+?)(?:\s+\{/\*.*?\*/\})?$", line)
        if hm:
            if current_item_lines:
                it = "\n".join(current_item_lines).strip()
                if it and not is_boilerplate(it):
                    items.append({
                        "section": " > ".join(heading_stack) if heading_stack else "root",
                        "text": it,
                        "type": "paragraph",
                    })
                current_item_lines = []
            level = len(hm.group(1))
            heading_text = hm.group(2).strip()
            heading_stack = heading_stack[:level - 1]
            heading_stack.append(heading_text)
            continue

        if re.match(r"^\s*\[[^\]]+\]:\s*\S", line) and not re.search(r"\[.*\]\(.*\)", line):
            continue

        if re.match(r"^\s*[-*_]{3,}\s*$", line):
            continue

        bm = re.match(r"^(\s*)[-*]\s+(.*)", line)
        if bm:
            bullet_text = bm.group(2)
            if not is_boilerplate(bullet_text):
                items.append({
                    "section": " > ".join(heading_stack) if heading_stack else "root",
                    "text": bullet_text,
                    "type": "bullet",
                })
            continue

        current_item_lines.append(line)

    if current_item_lines:
        it = "\n".join(current_item_lines).strip()
        if it and not is_boilerplate(it):
            items.append({
                "section": " > ".join(heading_stack) if heading_stack else "root",
                "text": it,
                "type": "paragraph",
            })

    enriched = []
    for item in items:
        text = item["text"]
        wc = count_words(text)
        sc = count_sentences(text)
        lc = count_links(text)
        links = extract_link_positions(text)
        has_expl, expl_depth = has_tech_explanation(text)
        is_editorial = any(kw in text for kw in EDITORIAL_KW)

        enriched.append({
            "file": filepath.name,
            "issue": issue_num,
            "date": meta.get("date", ""),
            "section": item["section"],
            "text": text,
            "type": item["type"],
            "word_count": wc,
            "sentence_count": sc,
            "link_count": lc,
            "links_on_verb": sum(1 for l in links if l["on_verb"]),
            "links": links,
            "has_explanation": has_expl,
            "explanation_depth": expl_depth,
            "is_editorial": is_editorial,
            "is_bullet": item["type"] == "bullet",
        })

    for cb in commentary_blocks:
        text = cb["content"]
        has_expl, expl_depth = has_tech_explanation(text)
        enriched.append({
            "file": filepath.name,
            "issue": issue_num,
            "date": meta.get("date", ""),
            "section": " > ".join(heading_stack) + " [commentary]" if heading_stack else "[commentary]",
            "text": text,
            "type": "commentary",
            "word_count": count_words(text),
            "sentence_count": count_sentences(text),
            "link_count": count_links(text),
            "links_on_verb": 0,
            "links": extract_link_positions(text),
            "has_explanation": has_expl,
            "explanation_depth": expl_depth,
            "is_editorial": True,
            "is_bullet": False,
            "commentary_type": cb["type"],
            "commentary_title": cb["title"],
        })

    return {
        "meta": meta,
        "issue": issue_num,
        "file": filepath.name,
        "item_count": len(enriched),
        "items": enriched,
    }


def build_summary(all_items: list) -> dict:
    items_by_section = defaultdict(int)
    total_words = 0
    total_sentences = 0
    editorial_count = 0
    commentary_count = 0
    bullet_count = 0
    explanation_counts = {"detailed": 0, "moderate": 0, "slight": 0, "none": 0}

    for item in all_items:
        items_by_section[item["section"]] += 1
        total_words += item["word_count"]
        total_sentences += item["sentence_count"]
        if item["is_editorial"]:
            editorial_count += 1
        if item["type"] == "commentary":
            commentary_count += 1
        if item["is_bullet"]:
            bullet_count += 1
        explanation_counts[item["explanation_depth"]] += 1

    n = max(len(all_items), 1)
    return {
        "total_items": len(all_items),
        "total_words": total_words,
        "total_sentences": total_sentences,
        "avg_words_per_item": round(total_words / n, 1),
        "avg_sentences_per_item": round(total_sentences / n, 1),
        "editorial_items": editorial_count,
        "commentary_blocks": commentary_count,
        "bullet_items": bullet_count,
        "paragraph_items": len(all_items) - bullet_count - commentary_count,
        "explanation_distribution": explanation_counts,
        "top_sections": dict(Counter(item["section"] for item in all_items).most_common(15)),
    }


def compute_verb_stats(all_items: list) -> dict:
    verb_counter = Counter()
    verb_link_counter = Counter()
    for item in all_items:
        for link in item.get("links", []):
            if link["on_verb"]:
                verb_link_counter[link["text"]] += 1
        for m in re.finditer(r"\[([^\]]+)\]\([^)]+\)", item.get("text", "")):
            verb_counter[m.group(1)] += 1
    total_links = sum(item["link_count"] for item in all_items)
    links_on_verb = sum(item["links_on_verb"] for item in all_items)
    items_with_links = sum(1 for item in all_items if item["link_count"] > 0)
    return {
        "total_links": total_links,
        "links_on_verb": links_on_verb,
        "links_on_verb_pct": round(100 * links_on_verb / max(total_links, 1), 1),
        "items_with_links": items_with_links,
        "items_with_links_pct": round(100 * items_with_links / max(len(all_items), 1), 1),
        "top_link_verbs": verb_link_counter.most_common(20),
    }


def collect_files() -> list:
    """Return newsletter files sorted by issue number."""
    files = (
        sorted(NEWSLETTER_DIR.glob("*.md"))
        + sorted(NEWSLETTER_DIR.glob("*.mdx"))
        + sorted(NEWSLETTER_DIR.glob("*/index.md"))
    )
    results = []
    for fp in files:
        name = fp.name
        parent = fp.parent.name if fp.parent != NEWSLETTER_DIR else ""
        full_name = f"{parent}/{name}" if parent else name
        if name in SKIP_FILES:
            continue
        if "announcing-a-lesser-loong" in full_name:
            continue
        if "in-depth-statx" in full_name:
            continue
        try:
            parsed = parse_newsletter(fp)
            parsed["file"] = full_name
            results.append(parsed)
        except Exception as e:
            print(f"Error parsing {fp}: {e}", file=sys.stderr)
    results.sort(key=lambda x: x["issue"])
    return results


def main():
    parser = argparse.ArgumentParser(
        description="Analyze TWiL newsletter content for style, brevity, and science communication."
    )
    parser.add_argument(
        "--summary", action="store_true",
        help="Print top-level summary only",
    )
    parser.add_argument(
        "--verb-stats", action="store_true",
        help="Print verb and link-placement statistics",
    )
    parser.add_argument(
        "--samples", choices=["editorial", "commentary", "detailed", "moderate"],
        help="Print sample items of the given category",
    )
    parser.add_argument(
        "--by-year", action="store_true",
        help="Print year-over-year trends",
    )
    args = parser.parse_args()

    issues = collect_files()

    all_items = []
    for iss in issues:
        for item in iss["items"]:
            item["_issue"] = iss["issue"]
            item["_file"] = iss["file"]
            all_items.append(item)

    if args.summary:
        s = build_summary(all_items)
        print(json.dumps(s, ensure_ascii=False, indent=2))
        return

    if args.verb_stats:
        print(json.dumps(compute_verb_stats(all_items), ensure_ascii=False, indent=2))
        return

    if args.by_year:
        by_year = defaultdict(lambda: {"issues": 0, "items": 0, "words": 0, "sent": 0, "edit": 0, "expl": 0})
        for iss in issues:
            date = iss["meta"].get("date", "")
            if not date:
                continue
            year = date[:4]
            items = iss["items"]
            by_year[year]["issues"] += 1
            by_year[year]["items"] += len(items)
            by_year[year]["words"] += sum(i["word_count"] for i in items)
            by_year[year]["sent"] += sum(i["sentence_count"] for i in items)
            by_year[year]["edit"] += sum(1 for i in items if i["is_editorial"])
            by_year[year]["expl"] += sum(1 for i in items if i["has_explanation"])
        result = {}
        for yr in sorted(by_year):
            d = by_year[yr]
            n = max(d["items"], 1)
            result[yr] = {
                "issues": d["issues"],
                "items": d["items"],
                "avg_words": round(d["words"] / n, 1),
                "avg_sentences": round(d["sent"] / n, 1),
                "editorial_pct": round(100 * d["edit"] / n, 1),
                "explained_pct": round(100 * d["expl"] / n, 1),
            }
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return

    if args.samples:
        cat = args.samples
        if cat == "editorial":
            pool = [i for i in all_items if i["is_editorial"] and i["type"] != "commentary"]
        elif cat == "commentary":
            pool = [i for i in all_items if i["type"] == "commentary"]
        elif cat == "detailed":
            pool = [i for i in all_items if i["explanation_depth"] == "detailed"]
        elif cat == "moderate":
            pool = [i for i in all_items if i["explanation_depth"] == "moderate"]
        for item in pool[:30]:
            print(f"[Issue {item['_issue']}] [{item['section']}] ({item['word_count']}w, {item['sentence_count']}s)")
            print(item["text"][:500])
            print("---")
        return

    # Full output
    output = {
        "total_issues": len(issues),
        "total_items": len(all_items),
        "summary": build_summary(all_items),
        "verb_stats": compute_verb_stats(all_items),
    }
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
