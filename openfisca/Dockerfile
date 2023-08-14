FROM python:3.11

RUN mkdir /usr/src/openfisca
WORKDIR /usr/src/openfisca
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . ./
EXPOSE 2000
CMD OPENFISCA_WORKERS=1 OPENFISCA_BIND_HOST="0.0.0.0:2000" gunicorn api --config config.py
