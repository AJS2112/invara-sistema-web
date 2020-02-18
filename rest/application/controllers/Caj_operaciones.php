<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Caj_operaciones extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->helper('fechas_helper');
		$this->load->model("caj_operaciones_m");
		$this->load->model("caj_movimientos_m");		
	}


	public function getList($idEmpresa,$idTipo){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->caj_operaciones_m->getList($idEmpresa,$idTipo);
			$data=array(
				"empresa"=>$idEmpresa,
				"tipo"=>$idTipo
			);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getOne(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$idEmpresa=$this->input->post("id_empresa",true);
			$idTipo=$this->input->post("id_tipo",true);
			$id=$this->input->post("id",true);
			if ($id){
				$data=$this->caj_operaciones_m->getOne($id);
			} else {
				$ultimo=$this->caj_operaciones_m->getLast($idEmpresa,$idTipo);
				$lastnumero=$ultimo["lastnumero"]+1;
				$lastcontrol=str_pad($lastnumero, 8, '0', STR_PAD_LEFT);

				$data=array(
					"id"=>0,
					"order_id"=>0,
					"last_update"=>0,
					"id_empresa"=>$idEmpresa,
					"id_tipo_operacion"=>$idTipo,
					"numero"=>$lastnumero,
					"nro_control"=>$lastcontrol,
					"fecha"=>fechaLocal(date("")),
					"fecha_registro"=>fechaLocal(date("")),
					"descripcion"=>"",							
					"monto"=>0,
					"id_moneda"=>"",
					"factor"=>0,
					"id_cotizacion"=>0,
					"id_status"=>0,
					"id_estado"=>0,
					"id_usuario"=>0,
				);


			}

			echo respuesta($auth_user,$data);
		}
	}

	public function nullOne(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				//LLENA VARIABLES
				$head=$this->input->post("head");

				//PROCESA HEADER
				$data=array(
					"id"=>$head["id"],
					"order_id"=>$head["order_id"],
					"last_update"=>$head["last_update"],
					"id_empresa"=>$head["id_empresa"],
					"id_tipo_operacion"=>$head["id_tipo_operacion"],
					"numero"=>$head["numero"],
					"nro_control"=>$head["nro_control"],
					"fecha"=>$head["fecha"],
					"fecha_registro"=>$head["fecha_registro"],
					"descripcion"=>$head["descripcion"],						
					"monto"=>$head["monto"],
					"id_cotizacion"=>$head["id_cotizacion"],
					"id_status"=>2,
					"id_estado"=>2,
					"id_usuario"=>$head["id_usuario"],
				);

				$lastId=$this->caj_operaciones_m->update($data);		
				
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

	public function setOne(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$head=$this->input->post("head");
				$pago=$this->input->post("pago");

				//PROCESA HEADER
				$data=array(
					"id"=>$head["id"],
					"order_id"=>$head["order_id"],
					"last_update"=>$head["last_update"],
					"id_empresa"=>$head["id_empresa"],
					"id_tipo_operacion"=>$head["id_tipo_operacion"],
					"numero"=>$head["numero"],
					"nro_control"=>$head["nro_control"],
					"fecha"=>$head["fecha"],
					"fecha_registro"=>$head["fecha_registro"],
					"descripcion"=>$head["descripcion"],						
					"monto"=>$head["monto"],
					"id_cotizacion"=>$head["id_cotizacion"],
					"id_status"=>1,
					"id_estado"=>1,
					"id_usuario"=>$head["id_usuario"],
				);

				//REGISTRO NUEVO
				if ($data["id"]==0){
					$ultimo=$this->caj_operaciones_m->getLast($data["id_empresa"],$data["id_tipo_operacion"]);
					$lastnumero=$ultimo["lastnumero"]+1;
					$lastcontrol=str_pad($lastnumero, 8, '0', STR_PAD_LEFT);

					$data["numero"]=$lastnumero;
					$data["nro_control"]=$lastcontrol;

					$lastId=$this->caj_operaciones_m->insert($data);		
				} else {
					$lastId=$this->caj_operaciones_m->update($data);
				}
				
				if ($lastId){
					//PROCESA DETALLE
					$delPago=$this->caj_movimientos_m->delete($lastId);	

					$dataPago=array(
						"id"=>0,
						"order_id"=>0,
						"last_update"=>0,
						"id_empresa"=>$head["id_empresa"],
						"fecha"=>fechaLocal($head["fecha"]),
						"id_tipo_operacion"=>$head["id_tipo_operacion"],
						"id_operacion"=>$lastId,
						"monto"=>$head["monto"],
						"id_moneda"=>$pago[$i]["id_moneda"],
						"factor"=>$pago[$i]["factor"],
						"id_instrumento"=>$pago["id_instrumento"],
						"id_cuenta"=>$pago["id_cuenta"],
						"id_banco"=>$pago["id_banco"],
						"numero_operacion"=>$pago["numero_operacion"],
					);

					$lastPago=$this->caj_movimientos_m->insert($dataPago);	

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



	public function anularOne(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				//LLENA VARIABLES
				$tipo=$this->input->post("tipo");
				$head=$this->input->post("head");
				$detail=$this->input->post("detail");

				//PROCESA HEADER
				$id=$head["id"];
				$data=array(
					'id'=>$head["id"],	
					'id_tipo'=>$head["id_tipo"],
					'numero'=>$head["numero"],
					'nro_control'=>$head["nro_control"],
					'fecha'=>fechaLocal($head["fecha"]),
					'fecha_registro'=>fechaLocal($head["fecha_registro"]),
					'id_doc_origen'=>$head["id_doc_origen"],
					'id_proveedor'=>$head["id_proveedor"],
					'monto_bruto'=>$head["monto_bruto"],
					'pct_descuento'=>$head["pct_descuento"],
					'pct_adicional'=>$head["pct_adicional"],
					'monto_neto'=>$head["monto_neto"],
					'monto_iva'=>$head["monto_iva"],
					'monto_total'=>$head["monto_total"],
					'id_status'=>2,
					'id_estado'=>$head["id_estado"],
					'id_usuario'=>$head["id_usuario"],
					'observacion'=>$head["observacion"],
				);

				if ($id!=0){//OPERACION EXISTENTE

					//CONFIGURA REGISTRO 
					$obj=array(
						"id_tipo"=>$head["id_tipo"],
						"id_operacion"=>$head["id"],
					);

					switch ($tipo["signo_inventario"]) {
						case '+':
							$this->_reversarInventario('-', $head["id_destino"], $obj);
							break;
						case '-':
							$this->_reversarInventario('+', $head["id_destino"], $obj);
							break;
						case 'M':
							$this->_reversarInventario('+', $head["id_origen"], $obj);						
							$this->_reversarInventario('-', $head["id_destino"], $obj);
							break;														
						default:
							# code...
							break;
					}

					//ELIMINAR DETALLE
					//$deldata = $this->inv_movimientos_m->delete($obj);

					$lastId=$this->caj_operaciones_m->update($data);
				
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
			$one=$this->caj_operaciones_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}
