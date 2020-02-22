<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name') }}</title>

        <!-- Fonts -->
        <link href="{{ mix('css/app.css') }}" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">

        <script src="http://creen-test.rasko-dev.website:35729/livereload.js?snipver=1"></script>
    </head>
    <body>
        <div id="app">Test</div>

        <script src="{{ mix('/js/app.js') }}"></script>
    </body>
</html>
