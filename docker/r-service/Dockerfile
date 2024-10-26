FROM rocker/r-ver:4.2.0

RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev \
    libfontconfig1-dev \
    libharfbuzz-dev \
    libfribidi-dev

RUN R -e "install.packages(c(\
    'plumber', \
    'tidyverse', \
    'caret', \
    'xgboost', \
    'baseballr', \
    'mgcv', \
    'prophet', \
    'testthat' \
    ))"

WORKDIR /app
COPY server /app
EXPOSE 8000

CMD ["R", "-e", "source('/app/src/api/server.R')"]
