<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sis_listas extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("sis_listas_m");
	}

	public function getByCampo($campo){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$datos=$this->sis_listas_m->getByCampo($campo);
			echo respuesta($auth_user,$datos);
		}
	}		

	public function getById($id){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$datos=$this->sis_listas_m->getById($id);
			echo respuesta($auth_user,$datos);
		}
	}		

	public function getByPadre($idPadre){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$datos=$this->sis_listas_m->getByPadre($idPadre);
			echo respuesta($auth_user,$datos);
		}
	}			

	public function getCampos(){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$datos=$this->sis_listas_m->getCampos();
			echo respuesta($auth_user,$datos);
		}
	}	
	/*
	public function getList($ids=NULL){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->sis_listas_m->getList($ids);
			echo respuesta($auth_user,$menu);
		}
	}	
	*/
	public function getList(){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$fk= implode($this->input->post());			
				$menu=$this->sis_listas_m->getList($fk);
				echo respuesta($auth_user,$menu);
			} else  {
				$fk=NULL;
				$menu=$this->sis_listas_m->getList($fk);
				echo respuesta($auth_user,$menu);				
				//echo error_msg(400);				
			}
			/*
			*/
		}	
	}

	public function getOne($id){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			//$one=$id;			

			$one=$this->sis_listas_m->getOne($id);
			/*				
			if ($id){
				$one=$this->sis_dashboard_m->getOne($id);
			} else {
				$menu=array(
					"id"=>0,
					"campo"=>"",
					"nombre"=>"Nuevo",
					"descrip"=>"",
					"id_padre"=>hex(0)
				);
			}
			*/
			echo respuesta($auth_user,$one);
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
					'order_id'=>$this->input->post("order_id",true),	
					'last_update'=>$this->input->post("last_update",true),	
					'campo'=>$this->input->post("campo",true),
					'nombre'=>$this->input->post("nombre",true),
					'descrip'=>$this->input->post("descrip",true),
					'id_padre'=>$this->input->post("id_padre",true),
				);

				if ($id!=0){
					$lastId=$this->sis_listas_m->update($data);
				}else{
					$lastId=$this->sis_listas_m->insert($data);		
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
			$one=$this->sis_listas_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	
		
}
