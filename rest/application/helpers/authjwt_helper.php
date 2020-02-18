<?php
defined('BASEPATH') OR exit('No direct script access allowed');

if (! function_exists('autoriza')){
	function autoriza(){
		$CI=& get_instance();
		$ci_header=$CI->input->request_headers();

		if (!isset($ci_header["Authorization"]) || empty($ci_header["Authorization"])){
			return false;								
		} else{
			$token = explode(" ", $ci_header["Authorization"]);
			$user = JWT::decode(trim($token[1],'"'));
			$CI->load->model('sis_login_m');
			if ($CI->sis_login_m->checkUser($user->id, $user->logname)!==false){
				return $user;
			} else {
				return false;						
			}
		}		
	}

}


function respuesta($usuario, $respuesta){
	$usuario->iat=time();
	$usuario->exp=time()+300;
	$jwt= JWT::encode($usuario,'');
	return json_encode(
		array(
			"code" => 0,
			"response"=>array(
				"token"=>$jwt,
				"datos"=>$respuesta
			)
		)
	);
}

function error_msg($idError){
	switch ($idError) {
		case 400:
			return json_encode(
				array(
					"code" => $idError,
					"response"=>array(
						"token"=>'',
						"datos"=>'Faltan paramentros, se esperaban algunos datos!'
					)
				)
			);
			break;
		case 401:
			return json_encode(
				array(
					"code" => $idError,
					"response"=>array(
						"token"=>'',
						"datos"=>'Usuario no autorizado!'
					)
				)
			);
			break;
		case 403:
			return json_encode(
				array(
					"code" => $idError,
					"response"=>array(
						"token"=>'',
						"datos"=>'Contenido prohibido!'
					)
				)
			);
			break;		
		case 404:
			return json_encode(
				array(
					"code" => $idError,
					"response"=>array(
						"token"=>'',
						"datos"=>'No se encuentra el recurso!'
					)
				)
			);
			break;			
		case 500:
			return json_encode(
				array(
					"code" => $idError,
					"response"=>array(
						"token"=>'',
						"datos"=>'Se produjo un error procesando el registro!'
					)
				)
			);
			break;			

		default:
			# code...
			break;
	}

}