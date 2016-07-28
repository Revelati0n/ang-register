<?php
header("Content-type:text/html; charset=UTF-8");
include("dbconnect.php");
$sql ="SELECT `ID` ,`name`, `PROVINCE_ID`, `AMPHUR_ID`, `DISTRICT`, `zipcode`, `position` FROM user_data";
$rows = $mysqli->query($sql);
$userData = array();
while ($row = mysqli_fetch_assoc($rows)) {
    array_push($userData,array(
                'ID' => $row['ID'],
                'name' => $row['name'],
                'provine' => $mysqli->query("SELECT PROVINCE_NAME FROM provinces WHERE PROVINCE_ID =".$row['PROVINCE_ID'])->fetch_assoc()['PROVINCE_NAME'],
                'amphure' => $mysqli->query("SELECT AMPHUR_NAME FROM amphures WHERE AMPHUR_ID =".$row['AMPHUR_ID'])->fetch_assoc()['AMPHUR_NAME'],
                'district' => $row['DISTRICT'],
                'zipcode' => $row['zipcode'],
                'position' => $row['position']

    ));
  }
  echo json_encode($userData);
?>
