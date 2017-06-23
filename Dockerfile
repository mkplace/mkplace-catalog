FROM python:2.7

RUN apt-get update -y

RUN mkdir -p /var/www/mkplace-catalog

WORKDIR /var/www/mkplace-catalog

RUN apt-get install -y libxml2-dev \
	locales \
	libxslt1-dev \
	uwsgi \
	uwsgi-plugin-python \
	python-dev \
	virtualenv \
	libev-dev \
	python-lxml

RUN locale-gen --purge pt_BR.UTF-8
RUN locale-gen pt_BR
RUN locale-gen pt_BR.UTF-8
RUN sed -i -e 's/# pt_BR.UTF-8 UTF-8/pt_BR UTF-8\npt_BR.UTF-8 UTF-8/' /etc/locale.gen
RUN dpkg-reconfigure --frontend=noninteractive locales

RUN update-locale LANG=pt_BR.UTF-8

RUN rm -rf /var/www/envs/catalog

RUN virtualenv /var/www/envs/catalog

ENV PYTHONPATH "${PYTHONPATH}:/var/www/mkplace-catalog/src"

RUN . /var/www/envs/catalog/bin/activate; pip install openpyxl requests redis slugify flask Pillow gunicorn pytz

EXPOSE 8000

ENV PYTHONUNBUFFERED 1

CMD ["sh", "bin/www-catalog"]
