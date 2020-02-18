<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Rep_compras extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->helper('fechas_helper');
		$this->load->model("rep_compras_m");
	}


	public function getOperacionesResumen(){
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

				$datos=$this->rep_compras_m->getOperacionesResumen($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getOperacionesDetalle(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'id_moneda'=>$this->input->post("idMoneda",true),
					'id_tipo'=>$this->input->post("idOperacion",true),
					'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),
				);

				$datos=$this->rep_compras_m->getOperacionesDetalle($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getProveedoresResumen(){
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

				$datos=$this->rep_compras_m->getProveedoresResumen($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getProveedoresDetalle(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'id_moneda'=>$this->input->post("idMoneda",true),
					'id_proveedor'=>$this->input->post("idProveedor",true),
					'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),
				);

				$datos=$this->rep_compras_m->getProveedoresDetalle($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	


}
