up: api notification redis

redis:
	docker-compose up -d redis

api:
	docker-compose up -d api

notification:
	docker-compose up -d socket