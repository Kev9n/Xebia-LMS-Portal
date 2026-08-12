ALTER TABLE course.courses 
  ALTER COLUMN target_audience TYPE TEXT[] USING string_to_array(target_audience, ',');
