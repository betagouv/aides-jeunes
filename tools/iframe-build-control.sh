FILE=./public/documents/iframe-integration.js


echo "Testing iframe build"
if [ -f "$FILE" ]; then
    echo "✅ $FILE exists"
else
    echo "❌ $FILE does not exists"
    exit 1
fi

if [ -s "$FILE" ]; then
    echo "✅ $FILE is not empty"
else
    echo "❌ $FILE is empty"
    exit 1
fi

if ! grep -q localhost "$FILE"; then
    echo "✅ $FILE does not contains string localhost"
else
    echo "❌ $FILE contains string localhost"
    exit 1
fi
