# Copy the files to a temporary local folder to escape the Nix store mount
mkdir -p ./tmp-bundle
cp Gemfile Gemfile.lock ./tmp-bundle/
cd ./tmp-bundle

# Run the command in isolation using a temporary nix shell that provides bundle
nix-shell -p ruby -p bundix --run "bundle lock --add-platform x86_64-linux && bundix"

# Move the updated files back to your project root
mv Gemfile.lock gemset.nix ../
cd ..
rm -rf ./tmp-bundle