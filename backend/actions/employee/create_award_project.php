<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
require_once __DIR__ . '/../../lib/award_project.php';

api_bootstrap(['POST']);
api_require_role('employee');
api_require_csrf();

award_project_execute(getConnection(), $_SESSION['emp_id'], true);
