FROM python:3.9.2-alpine

ENV PYTHONUNBUFFERED 1

COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY src/ ./src/

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /src

USER appuser

CMD [ "python", "src/main.py" ]
