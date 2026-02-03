<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: community.html");
    exit;
}

function clean($value) {
    return htmlspecialchars(strip_tags(trim($value)));
}

$to = "lancaster@roundtable.org.uk";
$subject = "CS Request";

$message = "
COMMUNITY SUPPORT REQUEST

ABOUT YOU
Name: " . clean($_POST['full_name']) . "
Organisation: " . clean($_POST['organisation']) . "
Applying As: " . clean($_POST['applying_as']) . "
Email: " . clean($_POST['email']) . "
Phone: " . clean($_POST['phone']) . "

ABOUT THE REQUEST
Support For: " . clean($_POST['support_for']) . "
Area: " . clean($_POST['area']) . "
Type: " . clean($_POST['support_type']) . "

Description:
" . clean($_POST['description']) . "

TIMESCALES
Time Sensitive: " . clean($_POST['time_sensitive']) . "
Deadline: " . clean($_POST['deadline']) . "
Amount Requested: " . clean($_POST['amount']) . "
Approached Others: " . clean($_POST['approached_others']) . "

SAFEGUARDING
Contact Allowed: " . clean($_POST['contact_permission']) . "
Internal Share: " . clean($_POST['internal_share']) . "
Public Share: " . clean($_POST['public_share']) . "

DECLARATION
Signed: " . clean($_POST['signature']) . "
Date: " . clean($_POST['date']) . "
";

$headers = "From: Lancaster Roundtable <lancaster@roundtable.org.uk>\r\n";
$headers .= "Reply-To: " . clean($_POST['email']);

mail($to, $subject, $message, $headers);

header("Location: thank-you.html");
exit;
