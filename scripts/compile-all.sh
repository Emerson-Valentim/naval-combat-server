hasNoElement () {
  local e match="$1"
  shift
  for e; do [[ "$e" == "$match" ]] && return 1; done
  return 0
}

cd services;

CURRENT_DIR=$(pwd)
EXCLUDED_PATHS=()

for d in */ ; do
	if(hasNoElement "$d" "${EXCLUDED_PATHS[@]}"); then
		echo "Compiling $d"
		osascript -e 'tell application "Terminal" to do script "cd '$CURRENT_DIR'/'$d'; yarn compile:watch;"'
	fi
done