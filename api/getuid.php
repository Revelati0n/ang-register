<?php
header("Content-type:text/html; charset=UTF-8");
session_start();
echo $_SESSION['UID'];
?>
