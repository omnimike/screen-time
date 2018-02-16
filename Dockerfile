FROM python:3
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY ./server .
COPY ./build static
EXPOSE 5000
CMD ["gunicorn", "-b", "0.0.0.0:5000", "wsgi"]
