<?php
/*
* Somprasong Intorruk API get
*/
header("Content-type:text/html; charset=UTF-8");


if (isset($_GET['var1']) || isset($_GET['var2']) || isset($_GET['var3'])){

  include("dbconnect.php");

  if (isset($_GET['var1'])){
    if (ctype_digit($_GET['var1'])){
      $sql = "SELECT PROVINCE_ID, PROVINCE_NAME FROM provinces WHERE  GEO_ID = ".$_GET['var1']." ORDER BY PROVINCE_NAME ASC";
      $result = $mysqli->query($sql);
      echo json_encode($result->fetch_all());
    }else{
      exit();
    }
  }

  if (isset($_GET['var2'])){
    if (ctype_digit($_GET['var2'])){
      $sql = "SELECT AMPHUR_ID, AMPHUR_NAME FROM amphures WHERE  PROVINCE_ID = ".$_GET['var2']." ORDER BY AMPHUR_NAME ASC";
      $result = $mysqli->query($sql);
      echo json_encode($result->fetch_all());
    }else{
      exit();
    }
  }

  if (isset($_GET['var3'])){
    if (ctype_digit($_GET['var3'])){
      $sql = "SELECT DISTRICT_ID, DISTRICT_NAME FROM districts WHERE  AMPHUR_ID = ".$_GET['var3']." ORDER BY DISTRICT_NAME ASC";
      $result = $mysqli->query($sql);
      echo json_encode($result->fetch_all());
    }else{
      exit();
    }
  }

}else{
  exit();
}





?>
