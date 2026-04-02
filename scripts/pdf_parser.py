import re, json, fitz, os

PDF_PATH = "/path/to/your/pdf"
TOPIC    = "Topic name"

IMG_OUT     = "/home/output_arm/images"
OUTPUT_JSON = "/home/output_arm/questions.json"

os.makedirs(IMG_OUT, exist_ok=True)

ANS_PATTERN = re.compile(r'Պատ\u2024\u055d(\d+)')

def extract_columns(page):
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
        ans_split = re.split(r'\n(?=\d+[\.\)][A-Za-zԱ-Ֆա-ֆ])', body)
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

def get_question_blocks(page):
    """Get all question text blocks with their bounding boxes and column side."""
    mid = page.rect.width / 2
    blocks = page.get_text("blocks")
    question_blocks = []
    for b in blocks:
        x0, y0, x1, y1, text = b[0], b[1], b[2], b[3], b[4]
        if ANS_PATTERN.search(text):
            side = "left" if x1 <= mid + 5 else "right"
            question_blocks.append({
                "x0": x0, "y0": y0, "x1": x1, "y1": y1,
                "side": side,
                "text": text
            })
    return question_blocks

def get_image_positions(page, doc):
    """Get all images on the page with their positions and pixel data."""
    images = []
    for img_info in page.get_images(full=True):
        xref = img_info[0]
        rects = page.get_image_rects(xref)
        if not rects:
            continue
        rect = rects[0]
        mid = page.rect.width / 2
        side = "left" if rect.x1 <= mid + 5 else "right"
        images.append({
            "xref": xref,
            "x0": rect.x0, "y0": rect.y0,
            "x1": rect.x1, "y1": rect.y1,
            "side": side
        })
    return images

# --- Extract questions ---
doc = fitz.open(PDF_PATH)
all_questions = []
for page in doc:
    left, right = extract_columns(page)
    for col in [left, right]:
        all_questions.extend(parse_column(col))

# --- Extract and match images by position ---
img_idx = 0
for page_num in range(len(doc)):
    page = doc[page_num]
    mid = page.rect.width / 2

    # Get all text blocks on THIS page only
    blocks = page.get_text("blocks")
    text_blocks = []
    for b in blocks:
        bx0, by0, bx1, by1, btext = b[0], b[1], b[2], b[3], b[4]
        if not btext.strip():
            continue
        b_side = "left" if bx1 <= mid + 5 else "right"
        text_blocks.append({
            "x0": bx0, "y0": by0, "x1": bx1, "y1": by1,
            "side": b_side, "text": btext
        })

    for img_info in page.get_images(full=True):
        xref = img_info[0]
        rects = page.get_image_rects(xref)
        if not rects:
            img_idx += 1
            continue

        rect = rects[0]
        img_y0 = rect.y0
        img_side = "left" if rect.x1 <= mid + 5 else "right"

        bi = doc.extract_image(xref)
        fname = f"q_{img_idx+1:03d}.{bi['ext']}"
        with open(f"{IMG_OUT}/{fname}", "wb") as f:
            f.write(bi["image"])

        # Find the nearest text block above the image on the same side, same page
        best_match = None
        best_distance = float('inf')
        for tb in text_blocks:
            if tb["side"] != img_side:
                continue
            if tb["y1"] > img_y0:
                continue
            distance = img_y0 - tb["y1"]
            if distance < best_distance:
                best_distance = distance
                best_match = tb["text"]

        if best_match:
            for q in all_questions:
                first_words = ' '.join(q["question_text"].split()[:6])
                if first_words and first_words in best_match.replace('\n', ' '):
                    q["image_url"] = f"/images/{fname}"
                    break

        img_idx += 1

# --- Assign IDs and save ---
for i, q in enumerate(all_questions, 1):
    q["id"] = i

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(all_questions, f, indent=2, ensure_ascii=False)

print(f"✅ {len(all_questions)} questions extracted")
print(f"✅ {img_idx} images saved to {IMG_OUT}/")
print(f"✅ JSON saved to {OUTPUT_JSON}")