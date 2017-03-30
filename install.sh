curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "Node Installed"
echo "=============="
node -v

cp tvserver_client.conf /etc/supervisor/conf.d/
service supervisor restart

echo "TV Server install complete."
