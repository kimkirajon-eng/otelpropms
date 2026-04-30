FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
# Shared klasörünü görebilmesi için PYTHONPATH
ENV PYTHONPATH=/app
CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "10000"]
