<?php
header("Content-type:text/html; charset=UTF-8");
session_start();

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$captcha = $request->response; //Captcha response send by client

        //Build post data to make request with fetch_file_contents
        $postdata = http_build_query(
          array(
            'secret' => '6LdVHSYTAAAAAK7L97-3Lim2GAOBmfXOQ4IPy6Ap', //secret KEy provided by google
            'response' => $captcha,                    // g-captcha-response string sent from client
            'remoteip' => $_SERVER['REMOTE_ADDR']
          )
        );

        //Build options for the post request
        $opts = array('http' =>
          array(
            'method'  => 'POST',
            'header'  => 'Content-type: application/x-www-form-urlencoded',
            'content' => $postdata
          )
        );

        //Create a stream this is required to make post request with fetch_file_contents
        $context  = stream_context_create($opts);

    /* Send request to Googles siteVerify API */
    $response=file_get_contents("https://www.google.com/recaptcha/api/siteverify",false,$context);
    $response = json_decode($response, true);
    if($response["success"]===false) {
        echo json_encode(array(
            "error" => 7
        ));
    } else {
        include("dbconnect.php");
        $sql ="INSERT INTO `user_data` (`firstname`, `surname`, `tel`, `telphone`, `rank`, `position`, `address`, `vilno`, `soi`, `road`, `PROVINCE_ID`, `AMPHUR_ID`, `DISTRICT`, `zipcode`, `lat`, `lng`, `for_fristname`, `for_surname`, `for_tel`, `for_telphone`, `for_rank`)
        VALUES ('".$request->firstname."',
               '".$request->surname."',
               '".$request->tel."',
               '".$request->telphone."',
               '".$request->rank."',
               '".$request->position."',
               '".$request->address."',
               '".$request->vilno."',
               '".$request->soi."',
               '".$request->road."',
               '".$request->PROVINCE_ID."',
               '".$request->AMPHURE_ID."',
               '".$request->DISTRICT."',
               '".$request->zipcode."',
               '".$request->lat."',
               '".$request->lng."',
               '".$request->for_firstname."',
               '".$request->for_surname."',
               '".$request->for_tel."',
               '".$request->for_telphone."',
               '".$request->for_rank."'
               )";
        $query = $mysqli->query($sql);
        $_SESSION["UID"] = $mysqli->insert_id;
        $mysqli->close();
	if($query) {
    echo json_encode(array(
    "error" => 0
    ));
	}else{
    echo json_encode(array(
    "error" => 1
    ));
  }

    }
?>
