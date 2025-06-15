<?php

$host = 'localhost:3307';
$dbname = 'correo_empresa';
$user = 'root';
$pass = '';

$con = mysqli_connect($host, $user, $pass, $dbname);

if(mysqli_connect_errno()){
    die("Se produjo un error ".mysqli_connect_error());
}
else{
    //echo "Conexión exitosa a la base de datos.";
}
?>