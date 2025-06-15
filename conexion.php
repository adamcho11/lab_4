<?php
$con = new mysqli("localhost:3307", "root", "", "correo_empresa");
if ($con->connect_error) {
    die("Error: " . $con->connect_error);
}