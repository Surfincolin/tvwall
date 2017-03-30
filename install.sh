curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install -y nodejs

echo "Node Installed"
echo "=============="
node -v

echo "Installing Node Modules"
echo "======================="
npm install

echo "Setting up Supervisor"
echo "======================="
cp tvserver_client.conf /etc/supervisor/conf.d/
service supervisor restart

echo "TV Server install complete."
