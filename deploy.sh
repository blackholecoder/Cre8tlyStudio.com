
# exitecho "Switching to branch main"
# git checkout main

echo "Building app..."
npm run build

echo "Deploying files to server"
sudo -i
 scp -r dist/* therealdrama:/var/www/html/sites/cre8tlystudio.com/ 
# rsync -avz --delete dist/ dev@159.89.245.180:/var/www/sites/phlokk.com

# cargo tauri build --bundles app --target universal-apple-darwin
# npx tauri build --debug --target universal-apple-darwin

echo "Done!"
