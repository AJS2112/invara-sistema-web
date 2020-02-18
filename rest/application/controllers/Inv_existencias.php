<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inv_existencias extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("inv_existencias_m");
	}


	public function getList(){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->inv_existencias_m->getList();
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getOne($id){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->inv_existencias_m->getOne($id);
				echo respuesta($auth_user,$data);
			}

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
					'id_producto'=>$this->input->post("id_producto",true),	
					'id_almacen'=>$this->input->post("id_almacen",true),
					'cantidad'=>$this->input->post("cantidad",true),
				);

				if ($id!=0){
					$lastId=$this->inv_existencias_m->update($data);
				}else{
					$lastId=$this->inv_existencias_m->insert($data);		
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
			$one=$this->inv_existencias_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}