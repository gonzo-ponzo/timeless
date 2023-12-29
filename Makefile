up:
	cd backend && docker compose -f docker-compose.yaml up -d --build

down:
	cd backend && docker compose -f docker-compose.yaml down && docker network prune --force

revision:
	cd backend && alembic revision --autogenerate

back:
	cd backend && alembic upgrade heads && gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --certfile=cert.pem --keyfile=key.pem --bind 191.96.1.245:8000 --daemon
	
front:
	cd frontend && npm run start

flower:
	cd backend && celery -A tasks.tasks flower --basic-auth=admin:admin

worker:
	cd backend && celery -A tasks.celery worker