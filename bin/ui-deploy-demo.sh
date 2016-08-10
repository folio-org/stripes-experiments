#!/bin/sh
#
# ui-deploy - creates a tenant, some Folio UI modules and
#             assign the modules to the tenant
#
# e.g.:
#
# create two tenants, with ui and non-ui modules
#
# $ tenant="demo" modules_ui="patrons" modules="trivial trivial-okapi" ./ui-deploy-demo.sh
#

#set -e

: ${tenant="demo"}
: ${modules_ui="patrons"}
: ${modules="trivial trivial-okapi"}
curl='curl -sSf'

module_json=$(mktemp)
tenant_json=$(mktemp)

########################################
# same 1st tenant as manual
#
cat > $tenant_json <<END
{
  "id" : "$tenant",
  "name" : "$tenant library",
  "description" : "$tenant Library"
}
END

echo "==> Create tenant '$tenant'"
$curl -w '\n' -X POST -D - \
  -H "Content-type: application/json" \
  -d @$tenant_json \
  http://localhost:9130/_/proxy/tenants


########################################
# ui modules
#
for module in $modules_ui
do
        
    # trivial module
    cat > $module_json <<END
{
  "id" : "$module",
  "name" : "$module",
  "uiDescriptor" : {
     "npm" : "$module"
  }
}
END

    echo ""
    echo "==> Create module '$module'"
    $curl -w '\n' -X POST -D - \
      -H "Content-type: application/json" \
      -d @$module_json  \
      http://localhost:9130/_/proxy/modules
  
    # Enable tenant
    tenant_enable_json=$(mktemp)
    cat > $tenant_enable_json <<END
{
  "id" : "$module"
}
END

    echo ""
    echo "==> Enable ui module '$module' for tenant '$tenant'"
    $curl -w '\n' -X POST -D - \
      -H "Content-type: application/json" \
      -d @$tenant_enable_json  \
      http://localhost:9130/_/proxy/tenants/$tenant/modules
  
    # get full info for trivial (repeat for each one returned above)
    $curl -w '\n' -D - http://localhost:9130/_/proxy/modules/$module
done

########################################
# non-ui modules
#
for module in $modules
do
    
    # trivial module
    cat > $module_json <<END
{
  "id" : "$module",
  "name" : "$module"
}
END

    echo ""
    echo "==> Create module '$module'"
    $curl -w '\n' -X POST -D - \
      -H "Content-type: application/json" \
      -d @$module_json  \
      http://localhost:9130/_/proxy/modules
  
    # Enable tenant
    tenant_enable_json=$(mktemp)
  cat > $tenant_enable_json <<END
{
  "id" : "$module"
}
END

    echo ""
    echo "==> Enable non-ui module '$module' for tenant '$tenant'"
    $curl -w '\n' -X POST -D - \
      -H "Content-type: application/json" \
      -d @$tenant_enable_json  \
      http://localhost:9130/_/proxy/tenants/$tenant/modules
  
    # get full info for trivial (repeat for each one returned above)
    $curl -w '\n' -D - http://localhost:9130/_/proxy/modules/$module
done

# get list of enabled modules for tenant
echo ""
echo "==> List modules for '$tenant'"
$curl -w '\n' -D - http://localhost:9130/_/proxy/tenants/$tenant/modules

# show module config
echo ""
for module in $($curl -w '\n' -D - http://localhost:9130/_/proxy/tenants/$tenant/modules |
    egrep '"id"' |awk '{print $3}' | sed -e 's/"//g')
do
    curl -w '\n'  http://localhost:9130/_/proxy/modules/$module
done
    

rm -f $module_json $tenant_json $tenant_enable_json
