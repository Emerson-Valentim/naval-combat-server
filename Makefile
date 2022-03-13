up: api notification redis mongo mongo-workbench

redis:
	docker-compose up -d redis

api:
	docker-compose up -d --build api

notification:
	docker-compose up -d --build socket

mongo:
	docker-compose up -d mongo mongo-workbench