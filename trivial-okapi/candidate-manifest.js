// Here's how I think the manifest should look:
// Note that this is only a sketch, not running code.

static manifest = {
  tenants: { path: '/tenants/:id' },
  tenant_modules: { path: '/tenants/:id/modules' },
  some_specific_tenant_module: { path: '/tenants/:tenantId/modules/:moduleId' },

  // Here's how Jason defined it: this could be a "shorthand":
  alternative_tenant_modules: { endpoint: 'tenants', suffix: ':id/modules' } }
};

