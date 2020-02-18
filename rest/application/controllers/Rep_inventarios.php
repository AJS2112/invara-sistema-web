<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Rep_inventarios extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->helper('fechas_helper');
		$this->load->model("rep_inventarios_m");
		$this->load->model("inv_productos_m");
	}


	public function getList($idEmpresa="",$idCategoria=""){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->rep_inventarios_m->getList($idEmpresa,$idCategoria);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getMovimientosResumen(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'id_categoria'=>$this->input->post("idCategoria",true),
					'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),
				);

				$datos=$this->rep_inventarios_m->getMovimientosResumen($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	

	public function getMovimientosDetalle(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$data=array(
					'id_empresa'=>$this->input->post("idEmpresa",true),
					'id_producto'=>$this->input->post("idProducto",true),
					'desde'=>fechaLocal($this->input->post("desde",true)),	
					'hasta'=>fechaLocal($this->input->post("hasta",true)),
				);

				$datos=$this->rep_inventarios_m->getMovimientosDetalle($data);		

				echo respuesta($auth_user,$datos);
			} else {
				echo error_msg(400);
			}
		}
	}	


}
