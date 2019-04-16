# Add lambda src and libs together, then zip

# Remove any leftover assets from functions
rm -rf build/*
rm lambda-layer-pymysql.zip

# Collect src to build
cp -r ./src/  ./build

# Install lambda packages to build
pip install -r src/python/requirements.txt -t build/python/

# Zip up the dist
zip -r lambda-layer-pymysql.zip build/

cd build/
zip -r ../lambda-layer-pymysql.zip .
