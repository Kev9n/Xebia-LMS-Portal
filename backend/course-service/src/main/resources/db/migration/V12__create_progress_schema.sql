CREATE TABLE IF NOT EXISTS course.course_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    student_id VARCHAR(255) NOT NULL,
    course_id UUID NOT NULL REFERENCES course.courses(id) ON DELETE CASCADE,
    last_accessed_submodule_id UUID REFERENCES course.submodules(id) ON DELETE SET NULL,
    last_accessed_content_id UUID REFERENCES course.content_items(id) ON DELETE SET NULL,
    last_accessed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, student_id, course_id)
);

CREATE TABLE IF NOT EXISTS course.content_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    student_id VARCHAR(255) NOT NULL,
    course_id UUID NOT NULL REFERENCES course.courses(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES course.course_modules(id) ON DELETE CASCADE,
    submodule_id UUID NOT NULL REFERENCES course.submodules(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES course.content_items(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, student_id, content_id)
);