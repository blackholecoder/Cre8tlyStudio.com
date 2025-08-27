
# exitecho "Switching to branch main"
# git checkout main

echo "Building app..."
npm run build

echo "Deploying files to server"
sudo -i
scp  -r dist/* dev@134.122.7.62:/var/www/sites/therealdrama.com
# rsync -avz --delete dist/ dev@159.89.245.180:/var/www/sites/phlokk.com

echo "Done!"
