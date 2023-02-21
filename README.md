# Installation

1. Clone the repository and install dependencies:
```
git clone https://github.com/jesselooney/hhs-scholarship-portal-cms.git
cd hhs-scholarship-portal-cms/
yarn
```

2. Set the Strapi environment variables. For development purposes, it is sufficient to use the example settings:
```
cp .env.example .env
```

3. Start the development database and import dummy data:
```
docker compose up -d
gunzip < example_db.sql.gz | docker exec -i hhs-scholarship-portal-cms-db-1 psql -U postgres
```

4. Start the Strapi development server:
```
yarn develop
```
When you first visit the admin page, you will be prompted to create an account to serve as a Super Admin. This will allow you to view and manage the data interactively.

# Usage

The Strapi user guide is available at https://docs.strapi.io/user-docs/latest/getting-started/introduction.html.

The API can be consumed via GraphQL, and a playground for queries is available at the `/graphql` route. This page also provide auto-generated documentation and a schema.