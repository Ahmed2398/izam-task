<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Izam Task</title>

    <meta name=”csrf-token” content="{{ csrf_token() }}">

    @viteReactRefresh
    @vite('resources/js/app.tsx')
</head>

<body id="root"></body>

</html>