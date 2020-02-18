<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sis_unidades extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("sis_unidades_m");
	}


	public function getList(){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->sis_unidades_m->getList();
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getOne($id){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->sis_unidades_m->getOne($id);
			} else {
				$data=array(
					"id"=>0,
					"id_tipo"=>"",					
					"nombre"=>"Nuevo",
					"nombre_display"=>"",
					"factor_conversion"=>0,
					"es_patron"=>0,					
				);
			}

			echo respuesta($auth_user,$data);
		}
	}


	public function setOne(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$id=$this->input->post("id",true);
				$data=array(
					'id'=>$this->input->post("id",true),	
					'id_tipo'=>$this->input->post("id_tipo",true),
					'nombre'=>$this->input->post("nombre",true),
					'nombre_display'=>$this->input->post("nombre_display",true),
					'factor_conversion'=>$this->input->post("factor_conversion",true),
					'es_patron'=>$this->input->post("es_patron",true),
				);

				if ($id!=0){
					$lastId=$this->sis_unidades_m->update($data);
				}else{
					$lastId=$this->sis_unidades_m->insert($data);		
				}


				if ($lastId){
					echo respuesta($auth_user,$lastId);
				}else{
					echo error_msg(500);
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
			$one=$this->sis_unidades_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}
