# dw-manager

## Dependencies

### Middleware/tools

#### Required

- Ruby: 2.7.1
- Rails: 6.0.3
- MySQL: 8.x
- Node.js
- yarn

##### for gem

- MySQL library: 8.x

#### Optional

##### Development

- Docker: >= 18.06
- docker-compose: >= 1.25.0
- direnv

## Setup

```sh
#------------------------------------------------------------------------------
# 1. Install `docker`, `docker-compose`, `direnv`
#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
# 2. Setup app
#------------------------------------------------------------------------------
cp .envrc.local.sample .envrc.local
vi .envrc.local
direnv allow .
docker-compose build
docker-compose run app bundle install
docker-compose run app racc lib/search_query/parser.y.rb
docker-compose run app rails db:setup
docker-compose up
open http://localhost:${DOCKER_HOST_APP_PORT}/
```

## Development

### Default login User

- User1
  - email: user1@localhost.local
  - pass: password
- User2
  - email: user2@localhost.local
  - pass: password
