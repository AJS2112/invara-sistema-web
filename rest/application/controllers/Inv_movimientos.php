<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inv_movimientos extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("inv_movimientos_m");
	}


	public function getList($idOperacion){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$data=$this->inv_movimientos_m->getList($idOperacion);
			echo respuesta($auth_user,$data);
		}
	}	

	public function setOne(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){

				//PROCESA DETALLE
				$data=array(
					"id_tipo"=>$this->input->post("id_tipo",true),
					"id_operacion"=>$this->input->post("id_operacion",true),
					"id_producto"=>$this->input->post("id_producto",true),
					"id_unidad"=>$this->input->post("id_unidad",true),
					"precio"=>$this->input->post("precio",true),
					"cantidad"=>$this->input->post("cantidad",true),
					//"id_impuesto"=>$this->input->post("id_impuesto",true),
					"valor_impuesto"=>$this->input->post("valor_impuesto",true),
				);

				$lastDetail=$this->inv_movimientos_m->insert($data);	

				//$elimino = $this->inv_movimientos_m->delete($id_producto);
			
				if ($lastDetail){
					echo respuesta($auth_user,$lastDetail);
				}else{
					echo error_msg(500);
				}
				/*
				*/
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
			$one=$this->inv_formulas_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}
