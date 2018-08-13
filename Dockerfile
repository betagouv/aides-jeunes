FROM python:2.7

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY api.py ./
COPY config.py ./
COPY requirements.txt ./

RUN pip install --upgrade -r requirements.txt

COPY start.sh /usr/local/bin/openfisca-start

RUN chmod +x /usr/local/bin/openfisca-start

CMD ["openfisca-start"]
