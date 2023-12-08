up:
	cd backend && docker compose -f docker-compose.yaml up -d --build

down:
	cd backend && docker compose -f docker-compose.yaml down && docker network prune --force

revision:
	cd backend && alembic revision --autogenerate

back:
	cd backend && alembic upgrade heads && gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind=0.0.0.0:8000
	
front:
	cd frontend && npm run start

flower:
	cd backend && celery -A tasks.tasks flower --basic-auth=gonzo:fuckingflower

worker:
	cd backend && celery -A tasks.celery worker