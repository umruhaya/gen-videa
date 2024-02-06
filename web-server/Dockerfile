# Uncomment the below two steps to manually
# Build a base image with python and alpine and compile postgres driver binaries for productions
# FROM python:3.10-alpine

# Install psycopg2 dependencies, psycopg2, then clean up in one RUN to keep the image slim
# RUN apk add --no-cache --virtual .build-deps gcc postgresql-dev python3-dev musl-dev \
#     && pip install --no-cache-dir psycopg2 \
#     && apk --purge del .build-deps

# or use a base image with pre compiled binaries for faster build times - the image is private btw :)
FROM us-central1-docker.pkg.dev/jetrr-vision/genvidea-main/python-psycopg2:3.10-alpine

# Set the working directory in the container to /app
WORKDIR usr/src/app

# Copy only the requirements.txt first, to leverage Docker cache
COPY ./requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application's code
COPY . .

# Set the environment variable for the port (if needed, otherwise it will be set by the platform)
ENV PORT=8080

# Run the Server
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT