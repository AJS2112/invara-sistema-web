<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Caj_movimientos extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("caj_movimientos_m");
	}


	public function getList($idEmpre=NULL){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->caj_movimientos_m->getList($idOperacion);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getOne($idOperacion=NULL){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->caj_movimientos_m->getOne($idOperacion);
			echo respuesta($auth_user,$menu);
		}
	}	

	/*
	public function setOne(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$id_tipo=$this->input->post("id_tipo",true);
				$id_operacion=$this->input->post("id_operacion",true);
				$lista=$this->input->post("lista",true);

				$elimino = $this->caj_movimientos_m->delete($id_producto);
				if ($elimino){
					for($i=0, $ni=count($lista); $i < $ni; $i++){			
						$data=array(
							"fecha"=>fechaLocal($head["fecha"]),
							"id_tipo"=>$id_tipo,
							"id_operacion"=>$id_operacion,
							"monto"=>$lista[$i]["monto"],
							"id_instrumento"=>$lista[$i]["id_instrumento"],
							"id_cuenta"=>$lista[$i]["id_cuenta"],
							"id_banco"=>$lista[$i]["id_banco"],
							"numero_operacion"=>$lista[$i]["numero_operacion"],
						);

						$lastId=$this->caj_movimientos_m->insert($data);		

					}

					if ($lastId){
						echo respuesta($auth_user,$lastId);
					}else{
						echo error_msg(500);
					}
				}
			} else {
				echo error_msg(400);
			}
		}
	}

	public function delOne($id){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$one=$this->inv_formulas_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	
	*/
}
