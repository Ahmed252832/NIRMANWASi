<?php
/**
 * Authentication Handler for NIRMAN Project
 * Handles user registration and login
 */

header('Content-Type: application/json');
session_start();

require_once '../config/db.php';
$conn = getConnection();

// Get request method
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// ============================================================
// REGISTER ENDPOINT
// ============================================================
if ($action === 'register' && $method === 'POST') {
    $firstName = trim($_POST['first_name'] ?? '');
    $lastName = trim($_POST['last_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $phone = trim($_POST['phone'] ?? '');
    $userType = trim($_POST['user_type'] ?? ''); // 'client', 'contractor'
    $companyName = trim($_POST['company_name'] ?? '');
    
    // Validation
    if (empty($firstName) || empty($lastName) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'All required fields must be filled.']);
        exit;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
        exit;
    }
    
    // Check if email already exists
    $stmt = $conn->prepare("SELECT Person_id FROM Person WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already registered.']);
        exit;
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert into Person table
    $stmt = $conn->prepare("INSERT INTO Person (First_Name, Last_Name, Email, Phone_No, Password) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $firstName, $lastName, $email, $phone, $hashedPassword);
    
    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $conn->error]);
        exit;
    }
    
    $personId = $conn->insert_id;
    
    // If Client
    if ($userType === 'client') {
        $stmt = $conn->prepare("INSERT INTO Client (Person_id, Company_Name, Approval_Status) VALUES (?, ?, 'Approved')");
        $stmt->bind_param("is", $personId, $companyName);
        $stmt->execute();
    }
    // If Contractor Representative
    elseif ($userType === 'contractor') {
        // Find or create contractor company
        $stmt = $conn->prepare("SELECT Cont_id FROM Contractor WHERE Email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $contId = $row['Cont_id'];
        } else {
            // Create new contractor
            $stmt = $conn->prepare("INSERT INTO Contractor (Company_Name, Contact_Person, Email, Phone_No) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $companyName, $firstName, $email, $phone);
            $stmt->execute();
            $contId = $conn->insert_id;
        }
        
        // Add as contractor representative
        $status = 'Pending';
        $stmt = $conn->prepare("INSERT INTO Contractor_Rep (Person_id, Cont_id, Approval_status) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $personId, $contId, $status);
        $stmt->execute();
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Registration successful! Please log in.',
        'person_id' => $personId
    ]);
    exit;
}

// ============================================================
// LOGIN ENDPOINT
// ============================================================
if ($action === 'login' && $method === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
        exit;
    }
    
    // Find person by email
    $stmt = $conn->prepare("SELECT Person_id, First_Name, Last_Name, Password FROM Person WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $person = $result->fetch_assoc();
    
    if (!$person || !password_verify($password, $person['PASSWORD'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
        exit;
    }
    
    $personId = $person['Person_id'];
    $actualRole = '';
    $roleId = null;
    
    // Check Employee
    $stmt = $conn->prepare("SELECT Emp_id, Designation FROM Employee WHERE Person_id = ?");
    $stmt->bind_param("i", $personId);
    $stmt->execute();
    $result = $stmt->get_result();
    $employee = $result->fetch_assoc();
    
    if ($employee) {
        $actualRole = ($employee['DESIGNATION'] === 'System Administrator') ? 'admin' : 'employee';
        $roleId = $employee['EMP_ID'];
    }
    
    // Check Client
    if (empty($actualRole)) {
        $stmt = $conn->prepare("SELECT Cl_id FROM Client WHERE Person_id = ?");
        $stmt->bind_param("i", $personId);
        $stmt->execute();
        $result = $stmt->get_result();
        $client = $result->fetch_assoc();
        
        if ($client) {
            $actualRole = 'client';
            $roleId = $client['CL_ID'];
        }
    }
    
    // Check Contractor Rep
    if (empty($actualRole)) {
        $stmt = $conn->prepare("SELECT Rep_id, Approval_status FROM Contractor_Rep WHERE Person_id = ?");
        $stmt->bind_param("i", $personId);
        $stmt->execute();
        $result = $stmt->get_result();
        $rep = $result->fetch_assoc();
        
        if ($rep) {
            if ($rep['Approval_status'] !== 'Approved') {
                echo json_encode(['success' => false, 'message' => 'Your account is pending admin approval.']);
                exit;
            }
            $actualRole = 'contractor';
            $roleId = $rep['REP_ID'];
        }
    }
    
    if (empty($actualRole)) {
        echo json_encode(['success' => false, 'message' => 'No role assigned to this account.']);
        exit;
    }
    
    // Store session
    $_SESSION['person_id'] = $personId;
    $_SESSION['role'] = $actualRole;
    $_SESSION['role_id'] = $roleId;
    $_SESSION['first_name'] = $person['First_Name'];
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful.',
        'role' => $actualRole,
        'person_id' => $personId,
        'first_name' => $person['First_Name']
    ]);
    exit;
}

// ============================================================
// LOGOUT ENDPOINT
// ============================================================
if ($action === 'logout' && $method === 'POST') {
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
    exit;
}

// ============================================================
// GET CURRENT USER ENDPOINT
// ============================================================
if ($action === 'current_user' && $method === 'GET') {
    if (isset($_SESSION['person_id'])) {
        echo json_encode([
            'success' => true,
            'person_id' => $_SESSION['person_id'],
            'role' => $_SESSION['role'],
            'role_id' => $_SESSION['role_id'],
            'first_name' => $_SESSION['first_name']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Not logged in.']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid request.']);
?>
