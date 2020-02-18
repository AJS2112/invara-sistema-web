<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inv_operaciones extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->helper('fechas_helper');
		$this->load->model("sis_unidades_m");
		$this->load->model("inv_operaciones_m");
		$this->load->model("inv_movimientos_m");
		$this->load->model("inv_productos_m");
	}


	public function getList($idEmpresa,$idTipo){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->inv_operaciones_m->getList($idEmpresa,$idTipo);
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
				$data=$this->inv_operaciones_m->getOne($id);
			} else {
				$ultimo=$this->inv_operaciones_m->getLast($idEmpresa,$idTipo);
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
					"id_destino"=>0,
					"id_status"=>0,
					"id_estado"=>0,
					"id_usuario"=>0,
					"observacion"=>"",									
				);
			}

			echo respuesta($auth_user,$data);
		}
	}


	private function _actualizarExistencia($idProducto, $signo, $cantidad){
		//EXISTENCIA
		$obj=array(
			"id_producto"=>$idProducto,
			"signo"=>$signo,
			"cantidad"=>$cantidad
		);					
		$inv=$this->inv_productos_m->existencia($obj);

	}

	private function _reversarInventario($listaAnterior, $signo){
		$_signo="N";
		if ($signo=="+")$_signo="-";
		if ($signo=="-")$_signo="+";
		for($i=0, $ni=count($listaAnterior); $i < $ni; $i++){			
			$obj=array(
				"id_producto"=>$listaAnterior[$i]["id_producto"],
				"signo"=>$_signo,
				"cantidad"=>$listaAnterior[$i]["cantidad"]
			);					
			$inv=$this->inv_productos_m->existencia($obj);
		}
	}

	public function nullOne(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				//LLENA VARIABLES
				$tipo=$this->input->post("tipo");
				$head=$this->input->post("head");
				$detail=$this->inv_movimientos_m->getList($head["id"]);

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
					"id_destino"=>0,
					"id_status"=>2,
					"id_estado"=>2,
					"id_usuario"=>$head["id_usuario"],
					"observacion"=>$head["observacion"],							
				);

				$lastId=$this->inv_operaciones_m->update($data);		
				
				if ($lastId){
					if ($tipo["signo_inventario"]!="N"){
						$this->_reversarInventario($detail, $tipo["signo_inventario"]);													
					}
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


	public function setOne(){
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
					"id_destino"=>0,
					"id_status"=>1,
					"id_estado"=>1,
					"id_usuario"=>$head["id_usuario"],
					"observacion"=>$head["observacion"],							
				);

				//REGISTRO NUEVO
				if ($head["id"]==0){
					$ultimo=$this->inv_operaciones_m->getLast($head["id_empresa"],$head["id_tipo_operacion"]);
					$lastnumero=$ultimo["lastnumero"]+1;
					$lastcontrol=str_pad($lastnumero, 8, '0', STR_PAD_LEFT);

					$data["numero"]=$lastnumero;
					$data["nro_control"]=$lastcontrol;

					$lastId=$this->inv_operaciones_m->insert($data);		
				} else {
					$lastId=$this->inv_operaciones_m->update($data);		
				}

				if ($lastId){
					//PROCESA DETALLE
					$delDetail=$this->inv_movimientos_m->delete($lastId);	
					for($i=0, $ni=count($detail); $i < $ni; $i++){			
						$movimiento=array(
							"id"=>0,
							"order_id"=>0,
							"last_update"=>0,
							"id_empresa"=>$head["id_empresa"],
							"id_tipo"=>$head["id_tipo_operacion"],
							"id_operacion"=>$lastId,
							"id_producto"=>$detail[$i]["id_producto"],
							"costo"=>$detail[$i]["costo"],
							"precio"=>$detail[$i]["precio"],
							"cantidad"=>$detail[$i]["cantidad"],
							"id_impuesto"=>$detail[$i]["id_impuesto"],
							"valor_impuesto"=>$detail[$i]["valor_impuesto"],
						);

						$lastDetail=$this->inv_movimientos_m->insert($movimiento);	

						//ACTUALIZA INVENTARIO
						$this->_actualizarExistencia($detail[$i]["id_producto"], $tipo["signo_inventario"], $detail[$i]["cantidad"]);
					}
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
					'id_empresa'=>$head["id_empresa"],
					'id_tipo'=>$head["id_tipo"],
					'numero'=>$head["numero"],
					'nro_control'=>$head["nro_control"],
					'fecha'=>fechaLocal($head["fecha"]),
					'fecha_registro'=>fechaLocal($head["fecha_registro"]),
					'id_origen'=>$head["id_origen"],
					'id_destino'=>$head["id_destino"],
					'id_usuario'=>$head["id_usuario"],
					'id_status'=>2,
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

					$lastId=$this->inv_operaciones_m->update($data);
				
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
			$one=$this->inv_operaciones_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}
