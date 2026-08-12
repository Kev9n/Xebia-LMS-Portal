ALTER TABLE course.courses 
  ALTER COLUMN learning_outcomes TYPE TEXT[] USING string_to_array(learning_outcomes, ','),
  ALTER COLUMN prerequisites TYPE TEXT[] USING string_to_array(prerequisites, ','),
  ALTER COLUMN career_opportunities TYPE TEXT[] USING string_to_array(career_opportunities, ','),
  ALTER COLUMN secondary_keywords TYPE TEXT[] USING string_to_array(secondary_keywords, ','),
  ALTER COLUMN focus_keywords TYPE TEXT[] USING string_to_array(focus_keywords, ','),
  ALTER COLUMN seo_tags TYPE TEXT[] USING string_to_array(seo_tags, ',');
