<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Error handling
ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/api-error.log');

try {
    require_once 'config.php';

    $method = $_SERVER['REQUEST_METHOD'];
    $action = isset($_GET['action']) ? $_GET['action'] : '';

    switch ($action) {
        case 'get_all':
            getAllPersons();
            break;
        case 'get':
            getPerson();
            break;
        case 'add':
            addPerson();
            break;
        case 'update':
            updatePerson();
            break;
        case 'delete':
            deletePerson();
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
    }
} catch (Exception $e) {
    http_response_code(500);
    error_log('API Error: ' . $e->getMessage());
    echo json_encode(['error' => $e->getMessage()]);
}

function getAllPersons() {
    global $conn;
    $sql = "SELECT id, nume, prenume, cnp, seria, numar, emis, valabil, adresa FROM persoane ORDER BY nume, prenume";
    $result = $conn->query($sql);
    
    $persons = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $persons[] = $row;
        }
    }
    echo json_encode($persons);
}

function getPerson() {
    global $conn;
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    $sql = "SELECT id, nume, prenume, cnp, seria, numar, emis, valabil, adresa, photo FROM persoane WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $row['photo'] = $row['photo'] ? 'data:image/png;base64,' . base64_encode($row['photo']) : null;
        echo json_encode($row);
    } else {
        echo json_encode(['error' => 'Persoană nu găsită']);
    }
}

function addPerson() {
    global $conn;
    $data = json_decode(file_get_contents('php://input'), true);
    
    $nume = $data['nume'] ?? '';
    $prenume = $data['prenume'] ?? '';
    $cnp = $data['cnp'] ?? '';
    $seria = $data['seria'] ?? '';
    $numar = $data['numar'] ?? '';
    $emis = $data['emis'] ?? null;
    $valabil = $data['valabil'] ?? null;
    $adresa = $data['adresa'] ?? '';
    $photo = isset($data['photo']) && $data['photo'] ? base64_decode(explode(',', $data['photo'])[1]) : null;
    
    $sql = "INSERT INTO persoane (nume, prenume, cnp, seria, numar, emis, valabil, adresa, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssssss', $nume, $prenume, $cnp, $seria, $numar, $emis, $valabil, $adresa, $photo);
    
    if ($stmt->execute()) {
        echo json_encode(['id' => $conn->insert_id, 'success' => true]);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
}

function updatePerson() {
    global $conn;
    $data = json_decode(file_get_contents('php://input'), true);
    
    $id = $data['id'] ?? 0;
    $nume = $data['nume'] ?? '';
    $prenume = $data['prenume'] ?? '';
    $cnp = $data['cnp'] ?? '';
    $seria = $data['seria'] ?? '';
    $numar = $data['numar'] ?? '';
    $emis = $data['emis'] ?? null;
    $valabil = $data['valabil'] ?? null;
    $adresa = $data['adresa'] ?? '';
    $photo = isset($data['photo']) && $data['photo'] ? base64_decode(explode(',', $data['photo'])[1]) : null;
    
    if ($photo) {
        $sql = "UPDATE persoane SET nume=?, prenume=?, cnp=?, seria=?, numar=?, emis=?, valabil=?, adresa=?, photo=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sssssssssi', $nume, $prenume, $cnp, $seria, $numar, $emis, $valabil, $adresa, $photo, $id);
    } else {
        $sql = "UPDATE persoane SET nume=?, prenume=?, cnp=?, seria=?, numar=?, emis=?, valabil=?, adresa=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssssssssi', $nume, $prenume, $cnp, $seria, $numar, $emis, $valabil, $adresa, $id);
    }
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
}

function deletePerson() {
    global $conn;
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    $sql = "DELETE FROM persoane WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
}
?>
