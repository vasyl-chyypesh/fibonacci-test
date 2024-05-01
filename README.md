# Fibonacci fun project

Test Project for Fibonacci Numbers.

### Requirements
- Git ([download](https://git-scm.com/downloads))
- Docker ([download](https://docs.docker.com/get-docker/))

### Run project in docker
```bash
git clone https://github.com/vasyl-chyypesh/fibonacci-test.git

cd fibonacci-test

docker-compose up --build
```

### Test via curl
POST data with a number:

```bash
curl -d '{"number":7}' -H "Content-Type: application/json" -X POST http://localhost:3000/input
```

This will send a response with a ticket ID in the body:

```bash
{ "ticket": 1 }
```

GET data by ticket ID:

```bash
curl http://localhost:3000/output/1
```

This will send a response with result data in the body:

```bash
{ "ticket": 1, "inputNumber": 7, "result": "13" }
```
