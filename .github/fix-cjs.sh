set -e
for file in ./dist/cjs/*.js; do
  echo "Renaming ${file} to ${file%.js}.cjs..."
  perl -pi -e 's#require\("(.*?)\.js"\)#require\("\1.cjs"\)#g' "${file}"
  mv "${file}" "${file%.js}.cjs"
done

