We are using Circle CI 2.0 with multiple Docker images, and the primary container is running Node.

> It is possible to specify multiple images for your job. Specify multiple images if, for example, you need to use a database for your tests or for some other required service. In a multi-image configuration job, all steps are executed in the container created by the first image listed. All containers run in a common network and every exposed port will be available on localhost from a primary container.

See [Using Multiple Docker Images](https://circleci.com/docs/2.0/executor-types/#using-multiple-docker-images)

Therefore, we need to package OpenFisca in a Docker Image.

See [Using Custom-Built Docker Images](https://circleci.com/docs/2.0/custom-images/)

The Docker Image running OpenFisca is packaged using the same `Dockerfile` used by `docker-compose.yml`.
Use the commands below to build the Docker Image and push it to Docker Hub.

```
docker build --no-cache -t betagouv/mes-aides-openfisca:0.0.1 .
docker login
docker push betagouv/mes-aides-openfisca:0.0.1
```

### How to trigger a build manually

https://docs.docker.com/docker-hub/builds/#remote-build-triggers
