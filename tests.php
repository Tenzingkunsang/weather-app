<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "weather_database";

$mysqli = mysqli_connect($servername, $username, $password, $database);

if (!$mysqli) {
die('Connection failed: ' . mysqli_connect_error());
}

if (isset($_GET['q'])) {
$city = $_GET["q"];
} else {
$city = 'Haridwar';
}

// Fetching data from OpenWeatherMap
$APIKEY = "a43f4731ced98f631fb4cba8b46b204b";
$url = "http://api.openweathermap.org/data/2.5/weather?&units=metric&appid=a43f4731ced98f631fb4cba8b46b204b&q=" . $city;
$response = file_get_contents($url);

if (!$response) {
die('Error fetching data from OpenWeatherMap');
}

$data = json_decode($response, true);

if (!$data) {
die('Error decoding data from OpenWeatherMap');
}


$temperature = $data["main"]["temp"];
$status = $data["weather"][0]["description"];
$humidity = $data["main"]["humidity"];
$windspeed = $data["wind"]["speed"];
$pressure = $data["main"]["pressure"];
$icon = $data["weather"][0]["icon"];
$weather_day = date("l");

// Store data in the database
$existingData = "SELECT * FROM weather_details WHERE city = '$city' AND DATE(weatherDate) = CURDATE()";
$result = mysqli_query($mysqli, $existingData);

if (!$result) {
die('Error in SELECT query: ' . mysqli_error($mysqli));
}

if (mysqli_num_rows($result) > 0) {
$row = mysqli_fetch_assoc($result);
$weatherData = array(
'city' => $row['city'],
'temperature' => $row['temperature'],
'status' => $row['status'],
'humidity' => $row['humidity'],
'windspeed' => $row['windspeed'],
'pressure' => $row['pressure'],
'weather_day' => $row['weather_day'],
'weatherDate' => $row['weatherDate'],
'icon' => $row['icon'],

);

// echo json_encode($weatherData);
} else {
$insertData = "INSERT INTO weather_details (city, temperature, status, humidity, windspeed, pressure, weather_day, weatherDate, icon)
VALUES ('$city', '$temperature', '$status', '$humidity', '$windspeed', '$pressure', '$weather_day', NOW(), '$icon')";

$result = mysqli_query($mysqli, $insertData);
if (!$result) {
die('Error in INSERT query: ' . mysqli_error($mysqli));
} else {
$weatherData = array(
'city' => $city,
'temperature' => $temperature,
'status' => $status,
'humidity' => $humidity,
'windspeed' => $windspeed,
'pressure' => $pressure,
'weather_day' => $weather_day,
'weatherDate' => date("Y-m-d H:i:s"),
'icon' => $icon
);
}
}

// Fetch past weather data
$existingData = "SELECT * FROM weather_details WHERE city = '$city' AND weatherDate >= DATE(NOW() - INTERVAL 7 DAY) ORDER BY weatherDate ASC";
$result = mysqli_query($mysqli, $existingData);

if (!$result) {
die('Error in SELECT query: ' . mysqli_error($mysqli));
}

if (mysqli_num_rows($result) > 0) {
while ($row = mysqli_fetch_assoc($result)) {
$rows[] = $row;
}
$json_data = json_encode($rows);
echo $json_data;
header('Content-Type: application/json');
}

mysqli_close($mysqli);
?>