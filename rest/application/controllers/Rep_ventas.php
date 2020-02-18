<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Rep_ventas extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->helper('fechas_helper');
		$this->load->model("rep_ventas_m");
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

				$datos=$this->rep_ventas_m->getOperacionesResumen($data);		

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

				$datos=$this->rep_ventas_m->getOperacionesDetalle($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getClientesResumen(){
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

				$datos=$this->rep_ventas_m->getClientesResumen($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getClientesDetalle(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'id_moneda'=>$this->input->post("idMoneda",true),
					'id_cliente'=>$this->input->post("idCliente",true),
					'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),
				);

				$datos=$this->rep_ventas_m->getClientesDetalle($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getDeudasResumen(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'id_moneda'=>$this->input->post("idMoneda",true),
					/*'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),*/
				);

				$datos=$this->rep_ventas_m->getDeudasResumen($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getDeudasDetalle(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'id_moneda'=>$this->input->post("idMoneda",true),
					'id_cliente'=>$this->input->post("idCliente",true),
					/*'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),*/
				);

				$datos=$this->rep_ventas_m->getDeudasDetalle($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getPagosDetalle(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'id_cliente'=>$this->input->post("idCliente",true),
					'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),
				);

				$datos=$this->rep_ventas_m->getPagosDetalle($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getComisionesResumen(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),
				);

				$datos=$this->rep_ventas_m->getComisionesResumen($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getUsuariosDetalle(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'id_usuario'=>$this->input->post("idUsuario",true),
					'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),
				);

				$datos=$this->rep_ventas_m->getUsuariosDetalle($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	


}
