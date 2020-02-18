<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sis_impuestos extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("sis_impuestos_m");
	}


	public function getList($idTipo=NULL){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->sis_impuestos_m->getList($idTipo);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getListByTipo($idTipo=NULL){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->sis_impuestos_m->getList($idTipo);
			echo respuesta($auth_user,$menu);
		}
	}

	public function getOne($id){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->sis_impuestos_m->getOne($id);
			} else {
				$data=array(
					"id"=>0,
					"id_tipo"=>"",					
					"codigo"=>"",
					"nombre"=>"Nuevo",
					"valor_display"=>"",
					"valor"=>"0",
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
					'codigo'=>$this->input->post("codigo",true),
					'nombre'=>$this->input->post("nombre",true),
					'valor_display'=>$this->input->post("valor_display",true),
					'valor'=>$this->input->post("valor",true),
				);

				if ($id!=0){
					$lastId=$this->sis_impuestos_m->update($data);
				}else{
					$lastId=$this->sis_impuestos_m->insert($data);		
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
			$one=$this->sis_impuestos_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}
