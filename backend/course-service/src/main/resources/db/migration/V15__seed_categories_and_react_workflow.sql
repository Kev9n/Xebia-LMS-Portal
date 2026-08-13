-- Categories (tenant-scoped)
INSERT INTO course.categories (id, tenant_id, name, slug, description, color, is_active, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Frontend Development', 'frontend-development', 'React, UI engineering, and modern web interfaces.', '#6C1D5F', true, NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Backend Engineering', 'backend-engineering', 'Java, Spring Boot, APIs, and microservices.', '#01AC9F', true, NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Cloud & DevOps', 'cloud-devops', 'Kubernetes, CI/CD, and platform engineering.', '#84117C', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- React.js Complete Guide course
INSERT INTO course.courses (
  id, tenant_id, title, description, published, category_id, created_at, updated_at
) VALUES (
  '50000000-0000-0000-0000-000000000002',
  '11111111-1111-1111-1111-111111111111',
  'React.js Complete Guide',
  'Master React fundamentals through hooks, state management, and a capstone project.',
  true,
  '40000000-0000-0000-0000-000000000001',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course.course_modules (id, tenant_id, course_id, title, position, created_at, updated_at) VALUES
  ('50000000-0000-0000-0000-000000000201', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000002', 'Introduction', 1, NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000202', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000002', 'Setup Environment', 2, NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000203', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000002', 'Components', 3, NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000204', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000002', 'Props & State', 4, NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000205', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000002', 'Events', 5, NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000206', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000002', 'Life Cycle', 6, NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000207', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000002', 'Hooks', 7, NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000208', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000002', 'Project', 8, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO course.submodules (id, tenant_id, module_id, title, position, created_at, updated_at) VALUES
  ('50000000-0000-0000-0000-000000000301', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000201', 'Introduction to React', 1, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO course.content_items (
  id, tenant_id, course_id, module_id, sub_module_id, title, type, storage_ref, position, created_at, updated_at
) VALUES (
  '50000000-0000-0000-0000-000000000401',
  '11111111-1111-1111-1111-111111111111',
  '50000000-0000-0000-0000-000000000002',
  '50000000-0000-0000-0000-000000000201',
  '50000000-0000-0000-0000-000000000301',
  'Introduction to React',
  'VIDEO_REFERENCE',
  '{"uiType":"VIDEO_REFERENCE","text":"Introduction to React"}',
  1,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course.enrollments (tenant_id, course_id, student_id, status, enrolled_at, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '50000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'ACTIVE',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;
