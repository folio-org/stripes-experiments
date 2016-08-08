Currently, stripes-loader is loaded from github so will need to be built manually rather than via prepublish script because of this:
https://github.com/npm/npm/issues/3055

    cd stripes-connect
    npm install
    cd ..
    cd stripes-core
    npm install
    cd node_modules/stripes-loader
    npm install
    npm run build
    cd ../..
    ln -s ../.. node_modules/@stripes-experiments  #(see notes regarding OS'es without symlink)
    npm start

Note: node.js version 6.x is required for running stripes-experiments. Older node.js 
versions are likely to fail due changes in react/redux



* Note for OS without symlinks (MS Windows): 

  For installing on an OS that does not support symbolic links,
  this bash script (or equivalent) can be used instead to the same effect,
  (assuming that Git bash or cygwin or similar is used). 
  It should be run in the project root (stripes-experiments/)
  You would furthermore need to change a line in ./stripes-core/webpack.config.base.js,
  please follow the comments regarding include and exclude in that file. 

   if [ ! -e "stripes-core/node_modules/\@stripes-experiments" ]; then
     mkdir stripes-core/node_modules/\@stripes-experiments
   fi
   for d in */ ; do
     dir=$(basename "$d")
     if [ "stripes-core" != $dir ]; then
       rm -r stripes-core/node_modules/\@stripes-experiments/$d
       cp -r $d stripes-core/node_modules/\@stripes-experiments/.
     fi
   done
