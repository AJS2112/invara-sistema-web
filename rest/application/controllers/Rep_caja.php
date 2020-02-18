<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Rep_caja extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->helper('fechas_helper');
		$this->load->model("rep_caja_m");
	}


	public function getInstrumentosResumen(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'id_moneda'=>$this->input->post("idMoneda",true),
					'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),
				);

				$datos=$this->rep_caja_m->getInstrumentosResumen($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getInstrumentosDetalle(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'id_moneda'=>$this->input->post("idMoneda",true),
					'id_instrumento'=>$this->input->post("idInstrumento",true),
					'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),
				);

				$datos=$this->rep_caja_m->getInstrumentosDetalle($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getCuentasResumen(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'id_moneda'=>$this->input->post("idMoneda",true),
					'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),
				);

				$datos=$this->rep_caja_m->getCuentasResumen($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getCuentasDetalle(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'id_moneda'=>$this->input->post("idMoneda",true),
					'id_cuenta'=>$this->input->post("idCuenta",true),
					'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),
				);

				$datos=$this->rep_caja_m->getCuentasDetalle($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	


}
