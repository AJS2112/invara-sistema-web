<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Emp_vehiculos extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("emp_vehiculos_m");
	}


	public function getList($idEmpresa){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->emp_vehiculos_m->getList($idEmpresa);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getOne($id){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->emp_vehiculos_m->getOne($id);
			} else {
				$data=array(
					"id"=>0,
					"id_empresa"=>"",
					"vehiculo"=>"",					
					"modelo"=>"",					
					"marca"=>"",
					"color"=>"",
					"placa"=>"",
					"racda"=>"",
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
					'id_empresa'=>$this->input->post("id_empresa",true),
					'vehiculo'=>$this->input->post("vehiculo",true),
					'modelo'=>$this->input->post("modelo",true),
					'marca'=>$this->input->post("marca",true),
					'color'=>$this->input->post("color",true),
					'placa'=>$this->input->post("placa",true),
					'racda'=>$this->input->post("racda",true),
				);

				if ($id!=0){
					$lastId=$this->emp_vehiculos_m->update($data);
				}else{
					$lastId=$this->emp_vehiculos_m->insert($data);		
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
			$one=$this->emp_vehiculos_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}