init:
	gcloud components update
	gcloud config set project avian-mystery-257322

deploy:
	gcloud app deploy

local-deploy:
	nodemon server.js
