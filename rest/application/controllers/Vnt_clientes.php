<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Vnt_clientes extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("vnt_clientes_m");
	}


	public function getDeudas($idCliente){
		
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$res=$this->vnt_clientes_m->getDeudas($idCliente);
			echo respuesta($auth_user,$res);
		}
		
	}	

	public function getList($idEmpresa){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->vnt_clientes_m->getList($idEmpresa);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getOne($idEmpresa=NULL, $id=NULL){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->vnt_clientes_m->getOne($id);
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
					"limite_credito"=>"",
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
					'limite_credito'=>$this->input->post("limite_credito",true),
					'observacion'=>$this->input->post("observacion",true),
				);

				if ($id!=0){
					$lastId=$this->vnt_clientes_m->update($data);
				}else{
					$lastId=$this->vnt_clientes_m->insert($data);		
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
			$one=$this->vnt_clientes_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}
