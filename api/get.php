<?php
/*
* Somprasong Intorruk API get
*/
header("Content-type:text/html; charset=UTF-8");


if (isset($_GET['var1']) || isset($_GET['var2']) || isset($_GET['var3'])){

  include("dbconnect.php");

  if (isset($_GET['var1']) && !isset($_GET['var2']) && !isset($_GET['var3'])){
    if (ctype_digit($_GET['var1'])){
      $sql = "SELECT AMPHUR_ID, DISTRICT_ID, DISTRICT_NAME FROM districts ORDER BY DISTRICT_NAME ASC";
      $result = $mysqli->query($sql);
      $a = array();
      while($row = $result->fetch_assoc()){
        array_push($a,array('AMPHUR_ID' => $row['AMPHUR_ID'],'DISTRICT_ID' => $row['DISTRICT_ID'],  'DISTRICT_NAME' => $row['DISTRICT_NAME']));
      }
      echo json_encode($a);
    }else{
      exit();
    }
  }

  if (isset($_GET['var1']) && isset($_GET['var2']) && !isset($_GET['var3'])){
    if (ctype_digit($_GET['var1']) && ctype_digit($_GET['var2'])){
      echo 'xxx2';
    }else{
      exit();
    }
  }

  if (isset($_GET['var1']) && isset($_GET['var2']) && isset($_GET['var3'])){
    if (ctype_digit($_GET['var1']) && ctype_digit($_GET['var2']) && ctype_digit($_GET['var3'])){
      echo 'xxx3';
    }else{
      exit();
    }
  }

}else{
  exit();
}





?>
