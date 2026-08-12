ALTER TABLE course.enrollments ALTER COLUMN tenant_id TYPE UUID USING tenant_id::uuid;
