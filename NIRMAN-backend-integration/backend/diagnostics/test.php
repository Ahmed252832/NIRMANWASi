<?php
require_once __DIR__ . '/../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
api_response(['success' => true, 'message' => 'PHP diagnostics are available.']);
