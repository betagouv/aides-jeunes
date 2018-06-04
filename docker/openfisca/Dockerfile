FROM python:2.7

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY openfisca/api.py ./
COPY openfisca/config.py ./
COPY openfisca/requirements.txt ./

RUN pip install --upgrade -r requirements.txt

COPY docker/openfisca/start.sh /usr/local/bin/openfisca-start

RUN chmod +x /usr/local/bin/openfisca-start

CMD ["openfisca-start"]
