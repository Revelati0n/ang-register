<?php
/* Config Database */
$db_config=array(
    "host"=>"localhost",
    "user"=>"root",
    "pass"=>"",
    "dbname"=>"userdb",
    "charset"=>"utf8"
);

/* Connect Databse */
$mysqli = @new mysqli($db_config["host"], $db_config["user"], $db_config["pass"], $db_config["dbname"]);

if(mysqli_connect_error()) {
    die('Connect Error (' . mysqli_connect_errno() . ') '. mysqli_connect_error());
    exit;
}else{
  $mysqli->set_charset($db_config["charset"]);
}

?>
