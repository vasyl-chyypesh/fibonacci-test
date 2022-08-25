# fibonacci-test

this is test project for fibonacci numbers

### requirements
- docker ([download](https://docs.docker.com/get-docker/))

### run project in docker
```docker-compose build```

```docker-compose up```

### test via curl
POST data with number:

```curl -d '{"number":7}' -H "Content-Type: application/json" -X POST http://localhost:3000/input```

GET data by tickerId:

```curl http://localhost:3000/output/1```
