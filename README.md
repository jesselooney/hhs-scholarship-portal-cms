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
yarn strapi import -f example_db.tar.gz
```

4. Run the Strapi development server:

```
yarn develop
```
