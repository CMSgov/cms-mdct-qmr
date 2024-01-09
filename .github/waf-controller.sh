#!/usr/bin/env bash

#set -e -o xtrace -o errexit -o pipefail -o nounset -u
set -o pipefail -o nounset -u

NAME="${1}"
ID="${2}"
RUNNER_IP="${3}/32"

CIRCUIT_BREAKER=10

DEBUG=false

$DEBUG && echo "Inputs:  NAME ${NAME}, ID ${ID}, RUNNER_IP ${RUNNER_IP}"

jitter() {
  SHORTEST=25
  LONGEST=500
  DIV=100
  EXP=$(perl -e "print $SHORTEST**$1")
  MIN=$(($EXP>$LONGEST ? $LONGEST : $EXP))
  RND=$(shuf -i$SHORTEST-$MIN -n1)
  perl -e "print $RND/$DIV"
}

for ((i=1; i <= $CIRCUIT_BREAKER; i++)); do
  WAF_CONFIG=$(aws wafv2 get-ip-set --scope CLOUDFRONT --id ${ID} --name ${NAME})
  $DEBUG && echo "Waf Config:  ${WAF_CONFIG}"

  IP_ADDRESSES=($(jq -r '.IPSet.Addresses | .[]' <<< ${WAF_CONFIG}))
  IP_ADDRESSES+=("$RUNNER_IP")

  STRINGIFIED=$(echo $(IFS=" " ; echo "${IP_ADDRESSES[*]}"))
  $DEBUG && echo "Ip Addresses:  ${STRINGIFIED}"

  OCC_TOKEN=$(jq -r '.LockToken' <<< ${WAF_CONFIG})
  $DEBUG && echo "LockToken:  ${OCC_TOKEN}"

  OUTPUT=$(aws wafv2 update-ip-set --scope CLOUDFRONT --id ${ID} --name ${NAME} --lock-token ${OCC_TOKEN} --addresses ${STRINGIFIED})
  CMD_CD=$?
  echo "AWS CLI Response Code:  ${CMD_CD}"
  echo "AWS CLI Response:  ${OUTPUT}"

  [[ $CMD_CD -ne 0 ]] || break

  SLEEP_FOR=$(jitter ${i})
  echo "Sleeping for ${SLEEP_FOR} seconds..."
  sleep ${SLEEP_FOR}
done
echo "Is this var available:  $i"
[[ $CIRCUIT_BREAKER == $i ]] && echo “Attempts to update WAF IPSet exceeded, exiting.” && exit 2
echo "Applied the IP successfully."
