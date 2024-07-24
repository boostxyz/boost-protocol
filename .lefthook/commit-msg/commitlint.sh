[[ -z "${RELEASING}" ]] && echo $(head -n1 $1) | npx commitlint --color || echo $(head -n1 $1)
