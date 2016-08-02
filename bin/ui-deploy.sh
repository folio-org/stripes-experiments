#!/bin/sh

# trivial module
cat > /tmp/ui-module-trivial.json <<END
{
  "id" : "trivial",
  "name" : "trivial",
  "uiDescriptor" : {
     "npm" : "trivial"
  }
}
END
curl -w '\n' -X POST -D - \
  -H "Content-type: application/json" \
  -d @/tmp/ui-module-trivial.json  \
  http://localhost:9130/_/proxy/modules

# same 1st tenant as manual
cat > /tmp/tenant1.json <<END
{
  "id" : "our",
  "name" : "our library",
  "description" : "Our Own Library"
}
END
curl -w '\n' -X POST -D - \
  -H "Content-type: application/json" \
  -d @/tmp/tenant1.json  \
  http://localhost:9130/_/proxy/tenants

# Enable tenant
cat > /tmp/enabletenant3.json <<END
{
  "id" : "trivial"
}
END
curl -w '\n' -X POST -D - \
  -H "Content-type: application/json" \
  -d @/tmp/enabletenant3.json  \
  http://localhost:9130/_/proxy/tenants/our/modules

# get list of enabled modules for tenant
curl -w '\n' -D - http://localhost:9130/_/proxy/tenants/our/modules

# get full info for trivial (repeat for each one returned above)
curl -w '\n' -D - http://localhost:9130/_/proxy/modules/trivial
