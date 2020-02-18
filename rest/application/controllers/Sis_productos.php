<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sis_productos extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("sis_productos_m");
	}


	public function getList($idEmpresa){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->sis_productos_m->getList($idEmpresa);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getListByEmpresa(){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$fk= implode($this->input->post());			
				$menu=$this->sis_productos_m->getListByEmpresa($fk);
				echo respuesta($auth_user,$menu);
			} else {
				echo error_msg(400);
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
			if ($id){
				$data=$this->sis_productos_m->getOne($id);
			} else {
				$data=array(
					"id"=>0,
					"nombre"=>"Nuevo",					
					"codigo"=>"",
					"empresas"=>array(),
					"id_unidad_compra"=>"",
					"id_unidad_venta"=>"0",
					"cantidad_unidad_compra"=>"1"
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
					'nombre'=>$this->input->post("nombre",true),
					'codigo'=>$this->input->post("codigo",true),
					'empresas'=>$this->input->post("empresas",true),
					'id_unidad_compra'=>$this->input->post("id_unidad_compra",true),
					'id_unidad_venta'=>$this->input->post("id_unidad_venta",true),
					'cantidad_unidad_compra'=>$this->input->post("cantidad_unidad_compra",true),
				);

				if ($id!=0){
					$lastId=$this->sis_productos_m->update($data);
				}else{
					$lastId=$this->sis_productos_m->insert($data);		
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
			$one=$this->sis_productos_m->delOne($id);
			echo respuesta($auth_user,$one);
		}
	}	

}