<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Emp_empleados extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("emp_empleados_m");
	}


	public function getList($idEmpresa){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->emp_empleados_m->getList($idEmpresa);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getOne($id){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->emp_empleados_m->getOne($id);
			} else {
				$data=array(
					"id"=>0,
					"id_empresa"=>"",
					"id_tipo"=>"",					
					"cedula"=>"",					
					"nombre"=>"",
					"pct_comision"=>0,
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
					'id_tipo'=>$this->input->post("id_tipo",true),
					'cedula'=>$this->input->post("cedula",true),
					'nombre'=>$this->input->post("nombre",true),
					'pct_comision'=>$this->input->post("pct_comision",true),
				);

				if ($id!=0){
					$lastId=$this->emp_empleados_m->update($data);
				}else{
					$lastId=$this->emp_empleados_m->insert($data);		
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
			$one=$this->emp_empleados_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}