up: consumer worker api notification

worker: redis bull

consumer: kafka zookeeper kafdrop app

redis:
	docker-compose up -d redis

bull:
	docker-compose up -d bull

kafka:
	docker-compose up -d kafka

zookeeper:
	docker-compose up -d zookeeper

app:
	docker-compose up -d consumer

api:
	docker-compose up -d api

notification:
	docker-compose up -d socket

kafdrop:
	docker-compose up -d kafdrop