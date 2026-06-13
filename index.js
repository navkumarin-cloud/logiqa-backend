const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.get('/questions', async (req, res) => {

  const search = req.query.search || '';

  const { data, error } = await supabase
    .from('question_versions')
    .select(`
      question_id,
      version_no,
      question_text,
      difficulty_score,
      questions (
        question_code,
        status
      )
    `)
    .ilike('question_text', `%${search}%`);

  res.json({
    data,
    error
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
