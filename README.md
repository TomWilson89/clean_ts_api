# Docker commands

### Build image

```bash
docker build -t <name of project> .
```

### Run container in interactive mode

```bash
docker run -it <name of project> sh
```

### Run container

```bash
docker run -p PORT:PORT <name of project>
```

### Check how much memory docker is taking

```bash
docker system df
```

#### and prune it

```bash
docker system prune
```

### Stop all container

```bash
docker stop $(docker ps -aq)
```

### Delete all container

```bash
docker rm $(docker ps -aq)
```

### Remove all images

```bash
docker rmi $(docker images -q)
```

### Remove all volumes

```bash
docker volume rm $(docker volume ls -q)
```
