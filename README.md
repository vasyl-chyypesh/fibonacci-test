# Fibonacci fun project

This is test project for fibonacci numbers.

### Requirements
- docker ([download](https://docs.docker.com/get-docker/))

### Run project in docker
```docker-compose build```

```docker-compose up --build```

### Test via curl
POST data with number:

```curl -d '{"number":7}' -H "Content-Type: application/json" -X POST http://localhost:3000/input```

It will send response with ticket id in body: `{ "ticket": 1 }`

GET data by ticket id:

```curl http://localhost:3000/output/1```
