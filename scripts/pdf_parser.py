import re, json, fitz, os

# ── CHANGE THESE TWO VALUES FOR EACH PDF ──────────────────────────────────────
PDF_PATH = "/path/to/your/file.pdf"
TOPIC    = "Your Topic Name"
# ──────────────────────────────────────────────────────────────────────────────

IMG_OUT     = "./images"
OUTPUT_JSON = "./questions.json"

os.makedirs(IMG_OUT, exist_ok=True)

ANS_PATTERN = re.compile(r'Ans\u2024\u055d(\d+)')

def extract_columns(page):
    """Extract left/right column text using PyMuPDF word positions.
    This preserves proper word spacing"""
    mid = page.rect.width / 2
    words = page.get_text("words")
    left_words, right_words = [], []
    for w in words:
        x0, y0, x1, y1, word = w[0], w[1], w[2], w[3], w[4]
        (left_words if x1 <= mid + 5 else right_words).append((y0, x0, word))

    def to_text(wlist):
        if not wlist:
            return ""
        wlist.sort(key=lambda w: (round(w[0] / 5) * 5, w[1]))
        lines, cur_line, cur_y = [], [], None
        for y, x, word in wlist:
            if cur_y is None or abs(y - cur_y) > 4:
                if cur_line:
                    lines.append(' '.join(cur_line))
                cur_line, cur_y = [word], y
            else:
                cur_line.append(word)
        if cur_line:
            lines.append(' '.join(cur_line))
        return '\n'.join(lines)

    return to_text(left_words), to_text(right_words)

def is_image_only_answers(answers):
    """Detect answers that are just numbers (e.g. '1','2','3') — image-label questions."""
    return all(re.fullmatch(r'\d+', a["text"].strip()) for a in answers)

def parse_column(col_text):
    parts = ANS_PATTERN.split(col_text)
    questions = []
    i = 0
    while i < len(parts) - 1:
        body    = parts[i].strip()
        correct = int(parts[i+1].strip())
        i += 2
        if not body:
            continue
        # Split on lines starting with digit+dot+letter (avoids splitting on decimals like "1.8 mm")
        ans_split = re.split(r'\n(?=\d+[\.\)][A-Za-z])', body)
        question_text = ans_split[0].strip().replace('\n', ' ')
        answers = []
        for a in ans_split[1:]:
            m = re.match(r'^(\d+)[\.\)]\s*(.+)', a.strip(), re.DOTALL)
            if m:
                answers.append({
                    "number": int(m.group(1)),
                    "text": m.group(2).strip().replace('\n', ' ')
                })
        if not question_text:
            continue
        has_image_answers = is_image_only_answers(answers) if answers else False
        questions.append({
            "question_text": question_text,
            "answers": answers if not has_image_answers else [],
            "correct_answer": correct,
            "has_image_answers": has_image_answers,
            "topic": TOPIC,
            "image_url": None,
            "explanation": None
        })
    return questions

# --- Extract questions ---
doc = fitz.open(PDF_PATH)
all_questions = []
for page in doc:
    left, right = extract_columns(page)
    for col in [left, right]:
        all_questions.extend(parse_column(col))

# --- Extract images ---
img_idx = 0
for pn in range(len(doc)):
    for img_info in doc[pn].get_images(full=True):
        bi = doc.extract_image(img_info[0])
        fname = f"q_{img_idx+1:03d}.{bi['ext']}"
        with open(f"{IMG_OUT}/{fname}", "wb") as f:
            f.write(bi["image"])
        if img_idx < len(all_questions):
            all_questions[img_idx]["image_url"] = f"/images/{fname}"
        img_idx += 1

# --- Assign IDs and save ---
for i, q in enumerate(all_questions, 1):
    q["id"] = i

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(all_questions, f, indent=2, ensure_ascii=False)

print(f"✅ {len(all_questions)} questions extracted")
print(f"✅ {img_idx} images saved to {IMG_OUT}/")
print(f"✅ JSON saved to {OUTPUT_JSON}")
