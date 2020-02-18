<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sis_operaciones extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("sis_operaciones_m");
	}


	public function getList($id=NULL){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->sis_operaciones_m->getList($id);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getListByTipo($idTipo=NULL){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->sis_operaciones_m->getList($idTipo);
			echo respuesta($auth_user,$menu);
		}
	}

	public function getOne($id){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->sis_operaciones_m->getOne($id);
			} else {
				$data=array(
					"id"=>0,
					"id_tipo"=>"",					
					"nombre"=>"",
					"nombre_display"=>"Nuevo",
					"descrip"=>"",
					"signo_inventario"=>"N",
					"signo_caja"=>"N",
					"es_fiscal"=>0,
					"es_autorizado"=>0,
					"es_visible"=>0,
					"es_derivado"=>0,
					"es_transporte"=>0,
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
					'nombre_display'=>$this->input->post("nombre",true),
					'descrip'=>$this->input->post("nombre_display",true),
					'signo_inventario'=>$this->input->post("signo_inventario",true),
					'signo_caja'=>$this->input->post("signo_caja",true),
					'es_fiscal'=>$this->input->post("es_fiscal",true),
					'es_autorizado'=>$this->input->post("es_autorizado",true),
					'es_visible'=>$this->input->post("es_visible",true),
					'es_derivado'=>$this->input->post("es_derivado",true),
					'es_transporte'=>$this->input->post("es_transporte",true),
				);

				if ($id!=0){
					$lastId=$this->sis_operaciones_m->update($data);
				}else{
					$lastId=$this->sis_operaciones_m->insert($data);		
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
