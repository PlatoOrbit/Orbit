init:
	gcloud components update
	npm install
	npm install -g nodemon
	gcloud config set project avian-mystery-257322

deploy:
	gcloud app deploy

local-deploy:
	nodemon server.js
