<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cmp_proveedores extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("cmp_proveedores_m");
	}


	public function getList($idEmpresa=NULL){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->cmp_proveedores_m->getList($idEmpresa);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getOne($idEmpresa,$id=NULL){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->cmp_proveedores_m->getOne($id);
			} else {
				$data=array(
					"id"=>0,
					"order_id"=>0,
					"last_update"=>0,
					"id_empresa"=>$idEmpresa,
					"nombre"=>"Nuevo",
					"rif"=>"",
					"direccion"=>"",
					"telefono"=>"",
					"email"=>"",
					"representante"=>"",
					"id_banco"=>"",
					"numero_cuenta"=>"",
					"observacion"=>"",					
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
					'nombre'=>$this->input->post("nombre",true),
					'rif'=>$this->input->post("rif",true),
					'direccion'=>$this->input->post("direccion",true),
					'telefono'=>$this->input->post("telefono",true),
					'email'=>$this->input->post("email",true),
					'representante'=>$this->input->post("representante",true),
					'id_banco'=>$this->input->post("id_banco",true),
					'numero_cuenta'=>$this->input->post("numero_cuenta",true),
					'observacion'=>$this->input->post("observacion",true),
				);

				if ($id!=0){
					$lastId=$this->cmp_proveedores_m->update($data);
				}else{
					$lastId=$this->cmp_proveedores_m->insert($data);		
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
			$one=$this->cmp_proveedores_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}
