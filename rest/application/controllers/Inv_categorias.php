<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inv_categorias extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("inv_categorias_m");
	}


	public function getList($idEmpresa=NULL){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->inv_categorias_m->getList($idEmpresa);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getOne($idEmpresa,$id=NULL){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->inv_categorias_m->getOne($id);
			} else {
				$data=array(
					"id"=>0,
					"order_id"=>0,
					"last_update"=>0,
					"id_empresa"=>$idEmpresa,
					"nombre"=>"Nuevo",
					"descrip"=>"",
					"id_padre"=>'00000000000000000000000000000000',					
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
					'descrip'=>$this->input->post("descrip",true),
					'id_padre'=>$this->input->post("id_padre",true),
				);
				//echo respuesta($auth_user,$data);
				if ($id!=0){
					$lastId=$this->inv_categorias_m->update($data);
				}else{
					$lastId=$this->inv_categorias_m->insert($data);		
				}
				//echo respuesta($auth_user,$lastId);

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
			$one=$this->inv_categorias_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}
