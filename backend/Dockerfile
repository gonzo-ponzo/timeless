FROM --platform=linux/amd64 python:3.11

RUN mkdir /app

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN chmod a+x *.sh

ENTRYPOINT ["/app/entrypoint.sh"]