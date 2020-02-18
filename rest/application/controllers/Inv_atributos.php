<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inv_atributos extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("inv_atributos_m");
	}


	public function getList($id){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$data=$this->inv_atributos_m->getList($id);
			echo respuesta($auth_user,$data);
		}
	}	
	/*
	public function getOne($id){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->inv_atributos_m->getOne($id);
			} else {
				$data=array(
					"id"=>0,
					"nombre"=>"Nuevo",
					"descrip"=>"",
					"es_default"=>0,					
				);
			}

			echo respuesta($auth_user,"$id: ".$id);
			//echo respuesta($auth_user,$data);
		}
	}
	*/

	public function setOne(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$id_producto=$this->input->post("id_producto",true);
				$lista=$this->input->post("lista",true);

				$elimino = $this->inv_atributos_m->delete($id_producto);
				if ($elimino){
					for($i=0, $ni=count($lista); $i < $ni; $i++){			
						$data=array(
							"id_producto"=>$id_producto,
							"nombre"=>$lista[$i]["nombre"],
							"valor"=>$lista[$i]["valor"]
						);

						$lastId=$this->inv_atributos_m->insert($data);		

					}

					if ($lastId){
						echo respuesta($auth_user,$lastId);
					}else{
						echo error_msg(500);
					}
				}
				/*
				*/
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
			$one=$this->inv_atributos_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}
