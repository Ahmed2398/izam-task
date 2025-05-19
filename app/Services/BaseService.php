<?php

namespace App\Services;

/**
 * Base Service class that all other services extend
 */
abstract class BaseService
{
    /**
     * Handle API responses
     *
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     * @return array
     */
    protected function response($data = null, string $message = 'Success', int $statusCode = 200): array
    {
        return [
            'data' => $data,
            'message' => $message,
            'status' => $statusCode,
        ];
    }
}
