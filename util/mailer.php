<?php 
$date = new DateTime();
if(isset($_POST['name'])){
	$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
}
if(isset($_POST['email'])){
	$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_STRING);
}
if(isset($_POST['phone'])){
	$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
}
if(isset($_POST['message'])){
	$originalMessage = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);
}
if(!($name && $email && $originalMessage)){
	echo 'Failed, please refresh and try again.';
	return;
}

$message = "<style>
*{
  padding: 0px;
  margin: 0px;
}
body {
  background-color: #bebebe
}
div.logo {
  background-color: #4f4f4f;
  padding: 15px;
  text-align: center;
  color: white;
}
div.logo img {
  max-width: 150px;
}
div.logo p {
  border-top: 2px solid white;
  max-width: 200px;
  margin: auto;
}
div.body {
	padding: 10px;
}
div.body p {
  font-size: 1.1em;
  margin-top: 5px;
  font-family: arial, helvetica, roboto, sans-serif;
}
</style>
<div class='logo'><img src='http://gianluigilamera.info/test/images/logo.png' alt='logo'>\r\n
  <p>Hair & Makeup Design</p> \r\n
</div>
<div class='body'>\r\n
	<p>Hello there Khri, you received a message from $name in date ". $date->format("Y/m/d ") .( +$date->format('H') + 2 ) % 24 . " that says:</p>\r\n
	<p>$originalMessage</p>\r\n
 	 <p>The user has left these contact details:</p>\r\n
	<p>Email: $email</p>\r\n
	<p>Phone: $phone</p>
	<p>Have a nice day! </p>
</div>";

$to      = $email;
$subject = $phone;
$message = $message;
$headers = "From: gianluigi@gianluigilamera.info\r\n";
$headers .= "Reply-To: gianluigi@gianluigilamera.info\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

if(mail($to, $subject, $message, $headers)): ?>
	<p>Thank you for getting in touch, your message will be forwarded in a few minutes and I'll be in touch with you shortly</p> 
<?php endif;?>

