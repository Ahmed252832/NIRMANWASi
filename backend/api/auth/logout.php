<?php
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
api_require_authenticated();
api_require_csrf();
api_destroy_session();

api_response([
    'success' => true,
    'message' => 'Signed out.'
]);
