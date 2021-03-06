up: aws-mock api notification redis mongo

restart: down up

aws-mock:
	docker-compose up -d localstack

redis:
	docker-compose up -d redis

api:
	docker-compose up -d api

notification:
	docker-compose up -d socket

mongo:
	docker-compose up -d mongo mongo-workbench

down:
	docker-compose down