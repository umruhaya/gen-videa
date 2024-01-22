# Use a lightweight base image
FROM python:3.10-alpine

# Set the working directory in the container to /app
WORKDIR usr/src/app

# Copy only the requirements.txt first, to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application's code
COPY . /app

# Set the environment variable for the port (if needed, otherwise it will be set by the platform)
ENV PORT=8000

# Run the Server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "$PORT"]