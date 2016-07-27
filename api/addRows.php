<?php
header("Content-type:text/html; charset=UTF-8");
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
        $sql = "INSERT INTO customer (CustomerID, Name, Email, CountryCode, Budget, Used)
		VALUES ('".$_POST["txtCustomerID"]."','".$_POST["txtName"]."','".$_POST["txtEmail"]."'
		,'".$_POST["txtCountryCode"]."','".$_POST["txtBudget"]."','".$_POST["txtUsed"]."')";

	$query = mysqli_query($conn,$sql);

	if($query) {
		echo "Record add successfully";
	}

	mysqli_close($conn);
        echo json_encode(array(
        "error" => 0
        ));
    }
?>
