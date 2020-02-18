<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sis_dashboard extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->helper('fechas_helper');
		$this->load->model("sis_dashboard_m");
	}


	public function getList(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),
				);

				$datos=$this->sis_dashboard_m->getList($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getCaja(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'desde'=>$this->input->post("desde",true),	
					'hasta'=>$this->input->post("hasta",true),
				);

				$datos=$this->sis_dashboard_m->getCaja($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	


	public function getOne($id){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			//$one=$id;			

			$one=$this->sis_dashboard_m->getOne($id);
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

	public function delOne($id){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$one=$this->sis_dashboard_m->delete($id);
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
					'campo'=>$this->input->post("campo",true),
					'nombre'=>$this->input->post("nombre",true),
					'descrip'=>$this->input->post("descrip",true),
					'id_padre'=>$this->input->post("id_padre",true),
				);

				if ($id!=0){
					$lastId=$this->sis_dashboard_m->update($data);
				}else{
					$lastId=$this->sis_dashboard_m->insert($data);		
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

}
