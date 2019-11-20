Docker
======

Il est possible d'utiliser Docker Compose pour lancer Mes Aides. 

[Installez Docker Compose](https://docs.docker.com/compose/install/)

```
docker-compose up
```

Mes Aides est ensuite disponible sur le port 8080 de la machine hôte Docker.

### Pulling the latest Docker image for OpenFisca

Mes Aides uses [a custom installation of OpenFisca](https://github.com/betagouv/mes-aides-openfisca). It is packaged as a Docker image, stored on [Docker Hub](https://hub.docker.com/r/betagouv/mes-aides-openfisca).

When a new image is built, you need to tell Docker to pull it from Docker Hub.

```
docker-compose pull && docker-compose up
```
