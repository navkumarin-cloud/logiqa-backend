const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post('/questions', async (req, res) => {

  const {
    question_code,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    solution_text,
    difficulty_score,
    language
  } = req.body;

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .limit(1)
    .single();

  const { data: question, error: questionError } = await supabase
    .from('questions')
    .insert({
      question_code,
      current_version: 1,
      status: 'DRAFT',
      creator_id: user.id
    })
    .select()
    .single();

  if (questionError) {
    return res.json(questionError);
  }

  const { data, error } = await supabase
    .from('question_versions')
    .insert({
      question_id: question.id,
      version_no: 1,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      solution_text,
      difficulty_score,
      language,
      created_by: user.id
    });

  res.json({
    data,
    error
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
