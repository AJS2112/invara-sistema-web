<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sis_sync extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("sis_sync_m");
	}


	public function getSyncList(){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$lista=$this->sis_sync_m->getList();
			echo respuesta($auth_user,$lista);
		}
	}	

	public function inSync(){
		$insync=$this->sis_sync_m->inSync();
		echo $insync;
	}	

	public function syncOne(){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$id=$this->input->post("id",true);
				$procedureName=$this->input->post("procedure_name",true);
				$parametros=json_decode($this->input->post("parameters",true),true);
				$res= $this->sis_sync_m->doSQL($procedureName,$parametros);
				if ($res){
					$this->sis_sync_m->delOne($id);
				}
				echo respuesta($auth_user,$res);

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
			$this->sis_sync_m->delOne($id);
			echo respuesta($auth_user,$one);
		}
	}






}
