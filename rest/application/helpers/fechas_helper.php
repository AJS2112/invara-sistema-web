<?php
function fechaLocal($fecha){
	date_default_timezone_set("America/Caracas");
	$miFecha= date_format(date_create($fecha), "Y/m/d");
	$miHora= date("H:i:s");
	$fecha= date_create($miFecha.' '.$miHora);
	return date_format($fecha, "Y-m-d H:i:s");
}