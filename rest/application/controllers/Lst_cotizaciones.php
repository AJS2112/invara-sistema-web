<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Lst_cotizaciones extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("lst_cotizaciones_m");
	}


	public function getList($idEmpresa=NULL){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->lst_cotizaciones_m->getList($idEmpresa);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getListDetail($id=NULL){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->lst_cotizaciones_m->getListDetail($id);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getLast($idEmpresa=NULL){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->lst_cotizaciones_m->getLast($idEmpresa);
			echo respuesta($auth_user,$menu);
		}
	}

	public function getLastWeb($idEmpresa=NULL){
		$datos=$this->lst_cotizaciones_m->getLast($idEmpresa);
		echo json_encode($datos);
	}

	public function getOne($idEmpresa,$id=NULL){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->lst_cotizaciones_m->getOne($id);
			} else {
				$ultimo=$this->lst_cotizaciones_m->getLastN($idEmpresa);
				$lastnumero=$ultimo["lastnumero"]+1;
				$lastcontrol=str_pad($lastnumero, 8, '0', STR_PAD_LEFT);

				$data=array(
					"id"=>0,
					"order_id"=>0,
					"last_update"=>0,
					"id_empresa"=>$idEmpresa,
					"numero"=>$lastnumero,
					"nro_control"=>$lastcontrol,
					"fecha"=>date("c"),					
					"observacion"=>"",
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
				$head=$this->input->post("head");
				$detail=$this->input->post("detail");

				$id=$this->input->post("id",true);
				$data=array(
					'id'=>$head["id"],
					'order_id'=>$head["order_id"],
					'last_update'=>$head["last_update"],
					'id_empresa'=>$head["id_empresa"],
					'numero'=>$head["numero"],
					'nro_control'=>$head["nro_control"],
					'fecha'=>$head["fecha"],
					'observacion'=>$head["observacion"],
				);
				//echo respuesta($auth_user,$data);
				
				$lastId=$this->lst_cotizaciones_m->insert($data);	

				if ($lastId){
					for($i=0, $ni=count($detail); $i < $ni; $i++){			
						$cotizacion=array(
							"id"=>0,
							"order_id"=>0,
							"last_update"=>0,
							"id_cotizacion"=>$lastId,
							"id_moneda"=>$detail[$i]["id_moneda"],
							"valor_anterior"=>$detail[$i]["valor_anterior"],
							"valor"=>$detail[$i]["valor"],
						);

						$lastDetail=$this->lst_cotizaciones_m->insertDetail($cotizacion);	
					}

				
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
			$one=$this->lst_cotizaciones_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}
