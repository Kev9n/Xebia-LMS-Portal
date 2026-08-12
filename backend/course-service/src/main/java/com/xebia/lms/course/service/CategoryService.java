package com.xebia.lms.course.service;

import com.xebia.lms.common.security.PermissionGuard;
import com.xebia.lms.common.security.TenantContext;
import com.xebia.lms.course.dto.CategoryRequest;
import com.xebia.lms.course.entity.Category;
import com.xebia.lms.course.repository.CategoryRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {

    private final CategoryRepository categories;
    private final PermissionGuard guard;

    public CategoryService(CategoryRepository categories, PermissionGuard guard) {
        this.categories = categories;
        this.guard = guard;
    }

    public List<Category> list() {
        guard.requireTenant();
        return categories.findByTenantId(TenantContext.tenantId());
    }

    @Transactional
    public Category create(CategoryRequest request) {
        guard.requireTenant();
        Category category = new Category();
        category.setTenantId(TenantContext.tenantId());
        category.setName(request.name());
        category.setSlug(request.slug());
        category.setIcon(request.icon());
        category.setDescription(request.description());
        category.setColor(request.color());
        category.setActive(request.isActive());
        return categories.save(category);
    }

    public Category get(java.util.UUID id) {
        guard.requireTenant();
        return categories.findById(id)
            .filter(c -> c.getTenantId().equals(TenantContext.tenantId()))
            .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Transactional
    public Category update(java.util.UUID id, CategoryRequest request) {
        Category category = get(id);
        category.setName(request.name());
        category.setSlug(request.slug());
        category.setIcon(request.icon());
        category.setDescription(request.description());
        category.setColor(request.color());
        category.setActive(request.isActive());
        return categories.save(category);
    }

    @Transactional
    public void delete(java.util.UUID id) {
        Category category = get(id);
        categories.delete(category);
    }
}
