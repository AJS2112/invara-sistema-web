<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sis_login extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->headers=$this->input->request_headers();
		$this->load->helper('authjwt_helper');
	}
	
	public function hola(){
		echo "HELLO!";
	}
	
	public function log(){
		//if ($this->input->is_ajax_request()){
			if (!$this->input->post("logname") || !$this->input->post("password")){
				echo json_encode(array("code"=>1, "response"=>"Datos insuficientes"));
			}
			$logname=$this->input->post("logname");
			$password=sha1($this->input->post("password",true));
			//$password=$this->input->post("password",true);
			$this->load->model('sis_login_m');

			$user=$this->sis_login_m->login($logname,$password);
			if ($user!==false){
				$user->iat=time();
				$user->exp=time()+300;
				$jwt=JWT::encode($user,'');
				echo json_encode(
					array(
						"code"=>0,
						"response"=>array(
							"token"=>$jwt,
							"datos"=>$user
						)
					)
				);
			} else {
				//echo $logname ." - ".$password;
				//echo "datos invalidos";
			}
		/*} else {
			show_404();
		}*/

	}

	public function sexo_get(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			/*$this->load->model("productos_m");
			$productos=$this->productos_m->get();
			echo respuesta($auth_user,$productos);
			*/echo "PAJA";
		}
	}	


}
