<?php
header("Content-type:text/html; charset=UTF-8");
session_start();
if (isset($_SESSION['UID'])){
  include("dbconnect.php");
  $sql ="SELECT `name`, `PROVINCE_ID`, `AMPHUR_ID`, `DISTRICT`, `zipcode`, `position` FROM user_data WHERE ID =".$_SESSION['UID'];
  $row = $mysqli->query($sql)->fetch_assoc();
  $userData = array(
              'code' => 0,
              'name' => $row['name'],
              'provine' => $mysqli->query("SELECT PROVINCE_NAME FROM provinces WHERE PROVINCE_ID =".$row['PROVINCE_ID'])->fetch_assoc()['PROVINCE_NAME'],
              'amphure' => $mysqli->query("SELECT AMPHUR_NAME FROM amphures WHERE AMPHUR_ID =".$row['AMPHUR_ID'])->fetch_assoc()['AMPHUR_NAME'],
              'district' => $row['DISTRICT'],
              'zipcode'=>$row['zipcode'],
              'position'=>$row['position']
            );
  echo json_encode($userData);
}else{
  echo json_encode(array('code' => 1));
}
?>
