<?php

function profile_photo_store_upload($file, $required = false)
{
    if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        if ($required) {
            api_error(400, 'Choose a profile photo.', 'profile_photo_required');
        }
        return null;
    }
    if (!isset($file['tmp_name'], $file['size'], $file['error']) ||
        $file['error'] !== UPLOAD_ERR_OK ||
        $file['size'] <= 0 ||
        $file['size'] > 2 * 1024 * 1024 ||
        !is_uploaded_file($file['tmp_name'])) {
        api_error(400, 'Profile photos must be valid images no larger than 2 MB.', 'invalid_profile_photo');
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);
    $allowedImages = [
        'image/jpeg' => ['extension' => 'jpg', 'type' => IMAGETYPE_JPEG],
        'image/png' => ['extension' => 'png', 'type' => IMAGETYPE_PNG],
        'image/webp' => ['extension' => 'webp', 'type' => IMAGETYPE_WEBP]
    ];
    $imageInfo = @getimagesize($file['tmp_name']);
    if (!isset($allowedImages[$mimeType]) ||
        $imageInfo === false ||
        $imageInfo[0] < 1 ||
        $imageInfo[1] < 1 ||
        $imageInfo[0] > 6000 ||
        $imageInfo[1] > 6000 ||
        $imageInfo[2] !== $allowedImages[$mimeType]['type']) {
        api_error(400, 'Use a JPG, PNG, or WebP profile photo.', 'invalid_profile_photo_type');
    }

    $relativeDirectory = 'uploads/profile-photos';
    $absoluteDirectory = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativeDirectory);
    if (!is_dir($absoluteDirectory) && !mkdir($absoluteDirectory, 0755, true)) {
        api_error(500, 'The profile photo directory is unavailable.', 'profile_photo_storage_failed');
    }

    $filename = bin2hex(random_bytes(16)) . '.' . $allowedImages[$mimeType]['extension'];
    $absolutePath = $absoluteDirectory . DIRECTORY_SEPARATOR . $filename;
    if (!move_uploaded_file($file['tmp_name'], $absolutePath)) {
        api_error(500, 'The profile photo could not be stored.', 'profile_photo_storage_failed');
    }
    return $relativeDirectory . '/' . $filename;
}

function profile_photo_delete_upload($relativePath)
{
    if (!$relativePath || !preg_match('#^uploads/profile-photos/[a-f0-9]{32}\.(?:jpg|png|webp)$#D', $relativePath)) {
        return;
    }
    $absoluteDirectory = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'profile-photos';
    $absolutePath = $absoluteDirectory . DIRECTORY_SEPARATOR . basename($relativePath);
    if (is_file($absolutePath)) {
        unlink($absolutePath);
    }
}
