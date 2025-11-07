<?php
include_once __DIR__.'/database.php';

$query = $_POST['query'] ?? '';

if ($query != '') {
    $sql = "SELECT id, nombre, marca FROM productos 
            WHERE nombre LIKE ? OR marca LIKE ? 
            ORDER BY nombre LIMIT 5";
    $stmt = $conn->prepare($sql);
    $param = "%$query%";
    $stmt->bind_param("ss", $param, $param);
    $stmt->execute();
    $result = $stmt->get_result();
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    echo json_encode($products);
}
?>