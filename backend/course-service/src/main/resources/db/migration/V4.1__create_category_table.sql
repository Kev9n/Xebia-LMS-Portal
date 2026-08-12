CREATE TABLE IF NOT EXISTS course.categories (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(240) NOT NULL,
    slug VARCHAR(240) NOT NULL,
    icon VARCHAR(1000),
    description TEXT,
    color VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ
);
