if [[ -z "${RELEASING}" ]]; then
  echo $(head -n1 $1) | npx commitlint --color
else
  echo $(head -n1 $1)
fi
