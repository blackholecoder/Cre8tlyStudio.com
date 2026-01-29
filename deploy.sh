
# exitecho "Switching to branch main"
# git checkout main

echo "Building app..."
npm run build

echo "Deploying files to server"
sudo -i
 scp -r dist/* therealdrama:/var/www/html/sites/themessyattic.com/ 


echo "Done!"
