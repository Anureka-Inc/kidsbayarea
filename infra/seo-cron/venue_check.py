#!/usr/bin/env python3
"""Flag proper nouns the optimizer added that appear nowhere in places.ts.

The playbook says FAQ/JSON-LD may only name venues that exist in
src/data/places.ts, but the LLM still invents or misplaces venues (closed
restaurants, an out-of-state school, a renamed chain). This reads added diff
lines on stdin, pulls capitalized multi-word phrases out of them, and prints
the ones that don't occur anywhere in places.ts (names, descriptions, tips —
so sub-features like "Stream Trail" and neighborhoods quoted in an entry
pass). Geography and common words are allowlisted. Over-triggers on purpose:
a false positive costs one glance at the PR.

Usage: git diff A..B -- src public/llms.txt | python3 venue_check.py places.ts
"""
import re
import sys

ALLOW = {
    # regions / cities / landmarks we reference without them being venues
    "Bay Area", "San Francisco", "East Bay", "South Bay", "North Bay",
    "Silicon Valley", "Golden Gate Park", "Golden Gate Bridge", "Marin County",
    "Santa Clara County", "San Mateo County", "Northern California",
    "Santa Cruz Mountains", "Lake Merritt", "Fisherman's Wharf", "Union Square",
    "Japantown", "Chinatown", "Mission District", "Memorial Day", "Labor Day",
    "Google Search Console", "Kids Bay Area", "Frequently Asked Questions",
    "Bay Area Family", "Bay Area Kids",
}
LEADING_STOP = re.compile(
    r"^(The|A|An|Top|Best|Free|Most|Many|Some|Popular|Standout|Check|For|In|At|"
    r"On|With|Try|Visit|Bring|Book|Our|Your|What|Where|Which|How|Are|Is|Can|"
    r"Yes|No|Also|Plus|And|Or|Both|All|Each|Every|Kids|Kid|Family|Families|"
    r"From|Independent|Outdoor|Unique|Toddler-friendly)\s+"
)
PHRASE = re.compile(r"\b[A-Z][\w'&.-]*(?:\s+(?:&|of|the|de|del|la)?\s*[A-Z][\w'&.-]*)+")
SPLIT = re.compile(r"(?:[.;:,()\u2014\u2013]\s+|\s+(?:at|and|or|in|on|near|from|to|with)\s+)")


def norm(text: str) -> str:
    return text.replace("&apos;", "'").replace("&amp;", "&").replace("&#x27;", "'")


def candidates(line: str):
    """Yield (phrase, forced) — forced=True for <strong>-wrapped names."""
    for strong in re.findall(r"<strong>(.*?)</strong>", line):
        yield norm(strong).strip(" .,"), True
    text = norm(re.sub(r"<[^>]+>", " ", line))
    for chunk in SPLIT.split(text):
        for m in PHRASE.finditer(chunk):
            phrase = m.group(0).strip(" .,;:'")
            while True:
                stripped = LEADING_STOP.sub("", phrase)
                if stripped == phrase:
                    break
                phrase = stripped
            yield phrase, False


def known(phrase: str, corpus: str, cities: set[str]) -> bool:
    p = phrase.lower()
    if p in corpus or p.removesuffix("'s") in corpus:
        return True
    # A city run into a known name ("Daly City Serramonte Center", common in
    # zh text with no separators, or "Ninja Republic San Mateo"): accept if
    # one half is a places.ts city and the other half is known. Generic
    # halves alone ("Park" + "Chow") don't count.
    words = phrase.split()
    for i in range(1, len(words)):
        head, tail = " ".join(words[:i]).lower(), " ".join(words[i:]).lower()
        if (head in cities and tail in corpus) or (tail in cities and head in corpus):
            return True
    return False


def main() -> int:
    raw_places = norm(open(sys.argv[1], encoding="utf-8").read())
    corpus = raw_places.lower()
    cities = {c.lower() for c in re.findall(r'city: "([^"]+)"', raw_places)}
    unknown: dict[str, str] = {}
    for raw in sys.stdin.read().splitlines():
        if not raw.startswith("+") or raw.startswith("+++"):
            continue
        line = raw[1:].strip()
        if line.startswith(("//", "/*", "*", "import ")) or "FAQ" in line and len(line) < 120:
            continue
        for phrase, forced in candidates(line):
            if not phrase or phrase in ALLOW:
                continue
            if not forced and " " not in phrase:
                continue
            if known(phrase, corpus, cities):
                continue
            unknown.setdefault(phrase, line[:140])
    for phrase, ctx in sorted(unknown.items()):
        print(f"{phrase}\t<- {ctx}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
