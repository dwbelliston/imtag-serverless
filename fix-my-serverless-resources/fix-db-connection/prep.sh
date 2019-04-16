# Using this to zip up the requirements with the lambda src

# Add lambda src and libs together, then zip

# Remove any leftover assets from functions
rm -rf fixed_build
rm fixed_lambda.zip

mkdir fixed_build

# Collect src to fixed_build
cp fixed_lambda.py  ./fixed_build

# Install lambda packages to fixed_build
pip install -r requirements.txt -t fixed_build/

# Zip up the dist
zip -r fixed_lambda.zip fixed_build/

cd fixed_build/
zip -r ../fixed_lambda.zip .

# remove this to clean up
cd ..
rm -rf fixed_build/