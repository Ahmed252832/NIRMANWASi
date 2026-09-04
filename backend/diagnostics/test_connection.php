<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
getConnection();
api_response(['success' => true, 'message' => 'Oracle connection succeeded.']);
