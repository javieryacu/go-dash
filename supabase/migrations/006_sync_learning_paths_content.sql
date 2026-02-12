-- Sync Learning Paths with Updated Standard Tracks Content
-- This updates existing learning_paths to have the same syllabus as their source standard_tracks

-- Update Retail-based learning paths
UPDATE learning_paths lp
SET syllabus_data = st.syllabus_template
FROM standard_tracks st
WHERE st.title LIKE 'Venta Retail%'
  AND lp.title LIKE 'Venta Retail%'
  AND lp.track_type = 'standard';

-- Update Restaurant-based learning paths  
UPDATE learning_paths lp
SET syllabus_data = st.syllabus_template
FROM standard_tracks st
WHERE st.title LIKE 'Atención Restaurante%'
  AND lp.title LIKE 'Atención Restaurante%'
  AND lp.track_type = 'standard';
