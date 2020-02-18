<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cnf_cuentasbancarias extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("cnf_cuentasbancarias_m");
	}


	public function getList($idEmpresa){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->cnf_cuentasbancarias_m->getList($idEmpresa);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getOne($idEmpresa,$id=NULL){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->cnf_cuentasbancarias_m->getOne($id);
			} else {
				$data=array(
					"id"=>0,
					"order_id"=>0,
					"last_update"=>0,
					"id_empresa"=>$idEmpresa,
					"id_banco"=>"",					
					"numero"=>"",
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
					'order_id'=>$this->input->post("order_id",true),
					'last_update'=>$this->input->post("last_update",true),
					'id_empresa'=>$this->input->post("id_empresa",true),	
					'id_banco'=>$this->input->post("id_banco",true),
					'numero'=>$this->input->post("numero",true),
				);

				if ($id!=0){
					$lastId=$this->cnf_cuentasbancarias_m->update($data);
				}else{
					$lastId=$this->cnf_cuentasbancarias_m->insert($data);		
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
			$one=$this->cnf_cuentasbancarias_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}