#!/usr/bin/env bash

CIRCUIT_BREAKER=10
AWS_RETRY_ERROR=254
#0, 1, 2 are the levels of debug, with 0 being off
DEBUG=2

set -o pipefail -o nounset -u

NAME="${1}"
ID="${2}"
RUNNER_IP="${3}/32"

[[ $DEBUG -ge 1 ]] && echo "Inputs:  NAME ${NAME}, ID ${ID}, RUNNER_IP ${RUNNER_IP}"

#Solution was found below and modified for this purpose
#https://serverfault.com/questions/1120769/check-if-ip-belongs-to-a-cidr
function find_cidr_for_ipv4 {
  local ip=$1
  shift;

  for cidr in "$@"; do
    nmap -sL -n $cidr | grep -q $ip && echo $cidr && exit 0
  done
  exit 1
}

#Remove IPV6 CIDR blocks
GHA_CIDRS=($(curl https://api.github.com/meta | jq -r '.actions | .[]' | grep -v ':'))

CIDR=$(find_cidr_for_ipv4 ${RUNNER_IP} ${GHA_CIDRS})
[[ $? -ne 0 ]] && echo "Cannot find CIDR block for ${RUNNER_IP}, please check https://api.github.com/meta.  Exiting." && exit 1

echo "CIDR for ${RUNNER_IP} is ${CIDR}";
exit 2

#Exponential backoff with jitter
jitter() {
  #.5 seconds
  SHORTEST=50
  #10 seconds
  LONGEST=1000
  DIV=100
  EXP=$(perl -e "print $SHORTEST**$1")
  MIN=$(($EXP>$LONGEST ? $LONGEST : $EXP))
  RND=$(shuf -i$SHORTEST-$MIN -n1)
  perl -e "print $RND/$DIV"
}

#Attempt to avoid resource contention from the start
sleep $(jitter $(shuf -i1-50 -n1))

for ((i=1; i <= $CIRCUIT_BREAKER; i++)); do
  #This loop is ONLY for retrying if the retries exceeded exception is thrown
  for ((j=1; j <= $CIRCUIT_BREAKER; j++)); do
    #Read WAF configuration from AWS
    WAF_CONFIG=$(aws wafv2 get-ip-set --scope CLOUDFRONT --id ${ID} --name ${NAME})
    CMD_CD=$?
    [[ $DEBUG -ge 1 ]] && echo "AWS CLI Read Response Code:  ${CMD_CD}"
    [[ $DEBUG -ge 2 ]] && echo "AWS CLI Read Response:  ${WAF_CONFIG}"

    #If the retries exceeded error code is returned, try again, otherwise exit the loop
    [[ $CMD_CD -eq $AWS_RETRY_ERROR ]] || break

    SLEEP_FOR=$(jitter ${j})
    echo "CLI retries exceed.  Waiting for ${SLEEP_FOR} seconds to execute read again...$({j})"
    sleep ${SLEEP_FOR}
  done

  #Unable to get the lock tocken and IP set so there isn't any point in attempting the write op
  [[ $j -ge $CIRCUIT_BREAKER ]] && echo “Attempts to read WAF IPSet exceeded” && sleep $(jitter ${i}) && continue

  #The loop was short circuited with an error code other than 0, so something is wrong
  [[ $CMD_CD -eq 0 ]] || ( echo "An unexpected read error occurred:  ${CMD_CD}" && exit 2 )

  echo "Read was successful."

  #Parse out IP set addresses to array
  IP_ADDRESSES=($(jq -r '.IPSet.Addresses | .[]' <<< ${WAF_CONFIG}))

  #This really can't happen because each node in the matrix gets a unique IP
  #grep -q $RUNNER_IP <<< ${IP_ADDRESSES}
  #[[ $? -ne 0 ]] || ( echo "IP is present in IP Set." && exit 0 )

  grep -q $CIDR <<< ${IP_ADDRESSES}
  [[ $? -ne 0 ]] || ( echo "CIDR is present in IP Set." && exit 0 )

  #Add runner IP to array
  IP_ADDRESSES+=("$RUNNER_IP")

  #Stringify IPs
  STRINGIFIED=$(echo $(IFS=" " ; echo "${IP_ADDRESSES[*]}"))
  [[ $DEBUG -ge 2 ]] && echo "Ip Addresses:  ${STRINGIFIED}"

  #Parse out optimistic concurrency control token
  OCC_TOKEN=$(jq -r '.LockToken' <<< ${WAF_CONFIG})
  [[ $DEBUG -ge 2 ]] && echo "LockToken:  ${OCC_TOKEN}"

  #This loop is ONLY for retrying if the retries exceeded exception is thrown
  for ((k=1; k <= $CIRCUIT_BREAKER; k++)); do
    #Write updated WAF configuration to AWS
    OUTPUT=$(aws wafv2 update-ip-set --scope CLOUDFRONT --id ${ID} --name ${NAME} --lock-token ${OCC_TOKEN} --addresses ${STRINGIFIED})
    CMD_CD=$?
    [[ $DEBUG -ge 1 ]] && echo "AWS CLI Write Response Code:  ${CMD_CD}"
    [[ $DEBUG -ge 2 ]] && echo "AWS CLI Write Response:  ${OUTPUT}"

    #If the retries exceeded error code is returned, try again, otherwise exit the loop
    [[ $CMD_CD -eq $AWS_RETRY_ERROR ]] || break

    #Using the outer loop to configure jitter is intentional, let's scale retries globally
    SLEEP_FOR=$(jitter ${k})
    echo "CLI retries exceed.  Waiting for ${SLEEP_FOR} seconds to execute write again...(${k})"
    sleep ${SLEEP_FOR}
  done

  [[ $CMD_CD -ne 0 ]] || break
  #Still not having success, so try again

  echo "Exit Code:  ${CMD_CD}"

  SLEEP_FOR=$(jitter ${i})
  echo "Waiting for ${SLEEP_FOR} seconds to execute main loop again...(${i})"
  sleep ${SLEEP_FOR}
done

[[ $DEBUG -ge 1 ]] && echo "Attempts to update ip set:  $i"

[[ $i -gt $CIRCUIT_BREAKER ]] && echo “Attempts to update WAF IPSet exceeded, exiting.” && exit 2

echo "Applied the IP successfully."

#Things should not have made it this far without being able to successfully write the IP
exit $CMD_CD
