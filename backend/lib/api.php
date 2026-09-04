<?php

function api_start_session()
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    ini_set('session.use_strict_mode', '1');
    $current = session_get_cookie_params();
    $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => $current['path'] ?: '/',
        'domain' => $current['domain'],
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    session_start();
}

function api_bootstrap($allowedMethods = null, $startSession = true)
{
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store');

    if ($startSession) {
        api_start_session();
    }

    if ($allowedMethods !== null) {
        api_require_method($allowedMethods);
    }
}

function api_require_method($allowedMethods)
{
    $allowedMethods = (array)$allowedMethods;
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

    if (!in_array($method, $allowedMethods, true)) {
        header('Allow: ' . implode(', ', $allowedMethods));
        api_error(405, 'This request method is not allowed.', 'method_not_allowed');
    }
}

function api_response($data, $status = 200)
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

function api_error($status, $message, $code)
{
    api_response([
        'success' => false,
        'message' => $message,
        'code' => $code
    ], $status);
}

function api_is_authenticated()
{
    return isset($_SESSION['person_id'], $_SESSION['role'], $_SESSION['role_id'])
        && in_array($_SESSION['role'], ['admin', 'employee', 'client', 'contractor'], true);
}

function api_require_authenticated()
{
    if (!api_is_authenticated()) {
        api_error(401, 'Authentication is required.', 'authentication_required');
    }
}

function api_require_role($allowedRoles)
{
    api_require_authenticated();
    $allowedRoles = (array)$allowedRoles;

    if (!in_array($_SESSION['role'], $allowedRoles, true)) {
        api_error(403, 'You are not authorized to access this resource.', 'forbidden');
    }
}

function api_identity()
{
    api_require_authenticated();

    return [
        'person_id' => $_SESSION['person_id'],
        'role' => $_SESSION['role'],
        'role_id' => $_SESSION['role_id'],
        'emp_id' => $_SESSION['emp_id'] ?? null
    ];
}

function api_establish_identity($personId, $role, $roleId, $firstName)
{
    api_start_session();
    $_SESSION = [];
    session_regenerate_id(true);

    $_SESSION['person_id'] = $personId;
    $_SESSION['role'] = $role;
    $_SESSION['role_id'] = $roleId;
    $_SESSION['first_name'] = $firstName;

    if ($role === 'admin' || $role === 'employee') {
        $_SESSION['emp_id'] = $roleId;
    }

    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

function api_csrf_token()
{
    api_require_authenticated();

    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function api_require_csrf()
{
    api_require_authenticated();
    $submittedToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($_POST['csrfToken'] ?? '');
    $sessionToken = $_SESSION['csrf_token'] ?? '';

    if ($submittedToken === '' || $sessionToken === '' || !hash_equals($sessionToken, $submittedToken)) {
        api_error(403, 'The security token is invalid or expired.', 'invalid_csrf_token');
    }
}

function api_clear_identity()
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        return;
    }

    $_SESSION = [];
}

function api_destroy_session()
{
    api_start_session();
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }

    session_destroy();
}

function api_log_oci_error($resource, $context)
{
    $error = oci_error($resource);
    $detail = $error && isset($error['message']) ? trim($error['message']) : 'Unknown OCI8 error';
    error_log('[NIRMAN] ' . $context . ': ' . $detail);
}

function api_database_error($resource, $context)
{
    api_log_oci_error($resource, $context);
    api_error(500, 'The request could not be completed.', 'database_error');
}

function api_is_iso_date($value)
{
    $date = DateTime::createFromFormat('!Y-m-d', $value);
    return $date && $date->format('Y-m-d') === $value;
}
