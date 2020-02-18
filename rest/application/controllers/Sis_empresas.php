<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sis_empresas extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("sis_empresas_m");
		$this->load->model("sis_listas_m");
	}


	public function getList(){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->sis_empresas_m->getList();
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getListByUser(){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$fk= implode($this->input->post());			
				$menu=$this->sis_empresas_m->getListByUser($fk);
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
		//echo "SIS_EMPRESAS CONTROLLER: ";
		//echo json_encode($auth_user);
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->sis_empresas_m->getOne($id);
			} else {
				$instrumentos=$this->sis_listas_m->getByCampo('instrumento_pago');
				$monedas=$this->sis_listas_m->getByCampo('monedas');
				$data=array(
					"id"=>0,
					"order_id"=>0,
					"last_update"=>0,
					"nombre"=>"Nuevo",					
					"rif"=>"",
					"direccion"=>"",
					"telefono"=>"",
					"es_inactivo"=>"0",
					"moneda_defecto"=>"11E8F819279E29CC9E9100270E383B06",
					/*"monedas"=>$monedas,
					"instrumentos_pago"=>$instrumentos*/
					"monedas"=>[],
					"instrumentos_pago"=>[],
					"es_modo_fiscal"=>"0",
					"pct_fiscal"=>"0",
					"fecha_contrato"=>fechaLocal(date("")),
				);
			}
			//echo "SEND RESPUESTA: ";
			//echo json_encode($auth_user);
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
					'nombre'=>$this->input->post("nombre",true),
					'rif'=>$this->input->post("rif",true),
					'direccion'=>$this->input->post("direccion",true),
					'telefono'=>$this->input->post("telefono",true),
					'es_inactivo'=>$this->input->post("es_inactivo",true),
					'moneda_defecto'=>$this->input->post("moneda_defecto",true),
					'monedas'=>$this->input->post("monedas",true),	
					'instrumentos_pago'=>$this->input->post("instrumentos_pago",true),	
					'es_modo_fiscal'=>$this->input->post("es_modo_fiscal",true),
					'pct_fiscal'=>$this->input->post("pct_fiscal",true),
					'fecha_contrato'=>$this->input->post("fecha_contrato",true),
				);

				if ($id!=0){
					$lastId=$this->sis_empresas_m->update($data);
				}else{
					$lastId=$this->sis_empresas_m->insert($data);		
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
			$one=$this->sis_empresas_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}
