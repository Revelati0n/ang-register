<?php
header("Content-type:text/html; charset=UTF-8");
include("dbconnect.php");
$sql ="SELECT `ID` ,`firstname`, `surname`, `tel`, `telphone`, `rank`, `position`, `address`, `vilno`, `soi`, `road`, `PROVINCE_ID`, `AMPHUR_ID`, `DISTRICT`, `zipcode`, `lat`, `lng`, `for_fristname`, `for_surname`, `for_tel`, `for_telphone`, `for_rank` FROM user_data";
$rows = $mysqli->query($sql);
$userData = array();
while ($row = mysqli_fetch_assoc($rows)) {
  $row['PROVINCE_ID'] = $mysqli->query("SELECT PROVINCE_NAME FROM provinces WHERE PROVINCE_ID =".$row['PROVINCE_ID'])->fetch_assoc()['PROVINCE_NAME'];
  $row['AMPHUR_ID'] = $mysqli->query("SELECT AMPHUR_NAME FROM amphures WHERE AMPHUR_ID =".$row['AMPHUR_ID'])->fetch_assoc()['AMPHUR_NAME'];

    array_push($userData,$row);
  }
  echo json_encode($userData);
?>
