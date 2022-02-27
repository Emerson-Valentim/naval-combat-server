while getopts s: option
  do
    case "${option}" in
    s) SERVICE=${OPTARG};
  esac
done

docker build -f ./services/$SERVICE/Dockerfile .