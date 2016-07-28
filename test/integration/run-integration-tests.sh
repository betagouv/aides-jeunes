set -e
TEST_DIR=`dirname $0`

for element in $TEST_DIR/*-suite
   do watai "$element"
done
