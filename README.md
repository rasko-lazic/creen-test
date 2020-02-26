## Creen test

### Installation instructions

After repository clone is complete run `componser install` to install Composer packages

Copy .env.example and rename it to .env
Generate laravel app key with `php artisan key:generate`

Fill `DB_USERNAME` and `DB_PASSWORD` with your Postgres username and password
Create database in Postgres called `battle_simulator`
Run migrations with `php artisan migrate`

Go into `resources/js`
Run `npm i` to install npm packages
Run `npm run hot` to serve frontend app at `http://localhost:3030/`

