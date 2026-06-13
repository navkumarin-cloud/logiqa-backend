const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.get('/questions', async (req, res) => {

  const { data, error } = await supabase
    .from('questions')
    .select(`
      question_code,
      status,
      current_version,
      question_versions (
        version_no,
        question_text,
        correct_answer,
        difficulty_score
      )
    `);

  res.json({
    data,
    error
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
