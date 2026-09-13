<?php
require_once __DIR__ . '/../lib/api.php';
api_start_session();
api_require_role('admin');
phpinfo();
