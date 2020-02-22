<?php

namespace App\Http\Middleware;

use Closure;
use Response;

class CORS {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next) {
        $headers = [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers' => $request->header('Access-Control-Request-Headers', '*'),
            'Access-Control-Max-Age' => 60 * 60 * 24
        ];
        if ($request->getMethod() == "OPTIONS") {
            // handle preflight request
            return Response::make('OK', 200, $headers);
        } else {
            $response = $next($request);
            foreach ($headers as $key => $value) {
                $response->headers->set($key, $value);
            }
            return $response;
        }
    }
}
