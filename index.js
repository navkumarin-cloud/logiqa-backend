const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.get('/questions/:code', async (req, res) => {

  const code = req.params.code;

  const { data, error } = await supabase
    .from('questions')
    .select(`
      question_code,
      status,
      current_version,
      question_versions (
        version_no,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        solution_text,
        difficulty_score,
        language
      )
    `)
    .eq('question_code', code)
    .single();

  res.json({
    data,
    error
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
