FILE=./public/documents/iframe-integration.js

Set -e

echo "Testing iframe build"
if [ -f "$FILE" ]; then
    echo "✅ $FILE exists"
    exit 1
else
    echo "❌ $FILE does not exists"
fi

if [ -s "$FILE" ]; then
    echo "✅ $FILE is not empty"
    exit 1
else
    echo "❌ $FILE is empty"
fi

if ! grep -q localhost "$FILE"; then
    echo "✅ $FILE does not contains string localhost"
    exit 1
else
    echo "❌ $FILE contains string localhost"
fi
