import re, json, fitz, os

# ── CHANGE THESE TWO VALUES FOR EACH PDF ──────────────────────────────────────
PDF_PATH = "/home/mike/Desktop/Driving PDFs/Maneuvering-Alignment on the roadway-Traffic priority.pdf"
TOPIC    = "Maneuvering-Alignment on the roadway-Traffic priority"
# ─────────────────────────────────────────────────────────────────────────────

IMG_OUT     = "./images"
OUTPUT_JSON = "./questions.json"

os.makedirs(IMG_OUT, exist_ok=True)

ANS_PATTERN = re.compile(r'Ans\u2024\u055d(\d+)')


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


def get_page_images(page, img_counter):
    """
    Extract images from a page with their position and column.
    Returns a list of dicts with keys: fname, x0, y0, x1, y1, col
    col is 'left' or 'right' based on where the image center sits.
    """
    mid = page.rect.width / 2
    page_images = []

    for img_info in page.get_images(full=True):
        xref = img_info[0]

        # get_image_rects returns the bounding boxes of where this image
        # appears on the page - we use this for positional matching
        rects = page.get_image_rects(xref)
        if not rects:
            continue

        rect = rects[0]
        center_x = (rect.x0 + rect.x1) / 2
        col = 'left' if center_x <= mid else 'right'

        bi = page.parent.extract_image(xref)
        fname = f"q_{img_counter[0]:03d}.{bi['ext']}"
        with open(f"{IMG_OUT}/{fname}", "wb") as f:
            f.write(bi["image"])

        img_counter[0] += 1

        page_images.append({
            "fname": fname,
            "y0": rect.y0,
            "y1": rect.y1,
            "col": col
        })

    return page_images


def match_images_to_questions(page_questions_left, page_questions_right, page_images):
    """
    Match each image to the question it visually belongs to using y-position.
    
    Each question occupies a vertical slot on the page. We find which question's
    vertical range the image's center y falls within. If we can't find an exact
    match we assign it to the closest question in the same column.
    """
    for img in page_images:
        img_center_y = (img["y0"] + img["y1"]) / 2
        col_questions = page_questions_left if img["col"] == "left" else page_questions_right

        if not col_questions:
            continue

        # Find the question whose y_start is closest to and above the image center
        best_match = None
        best_distance = float('inf')

        for q in col_questions:
            if "y_start" not in q:
                continue
            distance = abs(q["y_start"] - img_center_y)
            if distance < best_distance:
                best_distance = distance
                best_match = q

        if best_match and best_match["image_url"] is None:
            best_match["image_url"] = f"/images/{img['fname']}"


def parse_column_with_positions(col_text, col_words):
    """
    Same as parse_column but also records the approximate y_start
    of each question on the page for positional image matching.
    """
    parts = ANS_PATTERN.split(col_text)
    questions = []
    i = 0
    while i < len(parts) - 1:
        body    = parts[i].strip()
        correct = int(parts[i+1].strip())
        i += 2
        if not body:
            continue
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

        # Find the y position of the first word of this question in the column
        # so we can match images to questions by vertical position
        y_start = None
        first_words = question_text.split()[:3]
        for y, x, word in col_words:
            if any(word.startswith(fw[:4]) for fw in first_words if len(fw) >= 4):
                y_start = y
                break

        questions.append({
            "question_text": question_text,
            "answers": answers if not has_image_answers else [],
            "correct_answer": correct,
            "has_image_answers": has_image_answers,
            "topic": TOPIC,
            "image_url": None,
            "explanation": None,
            "y_start": y_start
        })
    return questions


def get_col_words(page):
    """Split page words into left and right column word lists."""
    mid = page.rect.width / 2
    words = page.get_text("words")
    left_words, right_words = [], []
    for w in words:
        x0, y0, x1, y1, word = w[0], w[1], w[2], w[3], w[4]
        (left_words if x1 <= mid + 5 else right_words).append((y0, x0, word))
    return left_words, right_words


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


# --- Main extraction ---
doc = fitz.open(PDF_PATH)
all_questions = []
img_counter = [1]  # use a list so it can be mutated inside the function

for page in doc:
    left_words, right_words = get_col_words(page)

    left_text  = to_text(left_words)
    right_text = to_text(right_words)

    left_questions  = parse_column_with_positions(left_text, left_words)
    right_questions = parse_column_with_positions(right_text, right_words)

    page_images = get_page_images(page, img_counter)

    match_images_to_questions(left_questions, right_questions, page_images)

    # Remove the y_start helper field before saving
    for q in left_questions + right_questions:
        q.pop("y_start", None)

    all_questions.extend(left_questions)
    all_questions.extend(right_questions)

# --- Assign IDs and save ---
for i, q in enumerate(all_questions, 1):
    q["id"] = i

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(all_questions, f, indent=2, ensure_ascii=False)

print(f"✅ {len(all_questions)} questions extracted")
print(f"✅ {img_counter[0] - 1} images saved to {IMG_OUT}/")
print(f"✅ JSON saved to {OUTPUT_JSON}")
