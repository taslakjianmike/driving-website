const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// ── CHANGE THESE VALUES PER THE DATABASE ──────────────────────────────────────
const DB_CONFIG = {
  host: 'host',
  port: 1234,
  database: 'db_name',
  user: 'db_user',
  password: 'db_password'
};
// ─────────────────────────────────────────────────────────────────────────────

const ALL_QUESTIONS_FILE = path.join(__dirname, '../all_questions.json');

async function seed() {
  const client = new Client(DB_CONFIG);
  await client.connect();
  console.log('✅ Connected to database');

  const raw = fs.readFileSync(ALL_QUESTIONS_FILE, 'utf-8');
  const questions = JSON.parse(raw);

  const topics = [...new Set(questions.map(q => q.topic))];
  console.log(`\nFound ${topics.length} topics:`);
  topics.forEach(t => console.log(`  - ${t}`));

  const topicIdMap = {};
  for (const topicName of topics) {
    const questionCount = questions.filter(q => q.topic === topicName).length;
    const result = await client.query(
      `INSERT INTO topics (name, question_count) VALUES ($1, $2) RETURNING id`,
      [topicName, questionCount]
    );
    topicIdMap[topicName] = result.rows[0].id;
    console.log(`✅ Inserted topic: ${topicName} (${questionCount} questions)`);
  }

  console.log(`\nInserting questions and answers...`);
  let questionCount = 0;
  let answerCount = 0;

  for (const q of questions) {
    const topicId = topicIdMap[q.topic];

    const result = await client.query(
      `INSERT INTO questions 
        (topic_id, question_text, correct_answer, has_image_answers, image_url, explanation)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [topicId, q.question_text, q.correct_answer, q.has_image_answers, q.image_url, q.explanation]
    );

    const questionId = result.rows[0].id;
    questionCount++;

    for (const answer of q.answers) {
      await client.query(
        `INSERT INTO answers (question_id, number, text) VALUES ($1, $2, $3)`,
        [questionId, answer.number, answer.text]
      );
      answerCount++;
    }

    if (questionCount % 100 === 0) {
      console.log(`  ${questionCount} questions inserted...`);
    }
  }

  await client.end();

  console.log(`\n✅ Seed complete!`);
  console.log(`   Topics:    ${topics.length}`);
  console.log(`   Questions: ${questionCount}`);
  console.log(`   Answers:   ${answerCount}`);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});