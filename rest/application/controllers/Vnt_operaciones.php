<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Vnt_operaciones extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->helper('fechas_helper');
		$this->load->model("vnt_operaciones_m");
		$this->load->model("inv_movimientos_m");
		$this->load->model("inv_productos_m");
		$this->load->model("caj_movimientos_m");		
	}


	public function getList($idEmpresa,$idTipo){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->vnt_operaciones_m->getList($idEmpresa,$idTipo);
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
				$data=$this->vnt_operaciones_m->getOne($id);
			} else {
				$ultimo=$this->vnt_operaciones_m->getLast($idEmpresa,$idTipo);
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
					"id_cliente"=>'00000000000000000000000000000000',
					"id_tipo_documento"=>'11E88BE7AA7287129A1500270E383B06',
					"nro_control_documento"=>"",
					"nro_documento"=>"",
					"fecha_documento"=>fechaLocal(date("")),
					"nro_factura_afectada"=>"",
					"id_doc_origen"=>'00000000000000000000000000000000',
					"id_cotizacion"=>'00000000000000000000000000000000',
					"monto_exento"=>0,
					"base_imponible_tg"=>0,
					"pct_alicuota_tg"=>0,
					"base_imponible_tr"=>0,
					"pct_alicuota_tr"=>0,
					"base_imponible_ta"=>0,
					"pct_alicuota_ta"=>0,
					"pct_descuento"=>0,
					"pct_adicional"=>0,
					"id_status"=>0,
					"id_estado"=>0,
					"id_usuario"=>0,
					"observacion"=>"",							
				);

				$this->load->model("sis_impuestos_m");
				$impuestos=$this->sis_impuestos_m->getListByTipo("11E7A7016E303D9D9B0700270E383B06");
				for($i=0, $ni=count($impuestos); $i < $ni; $i++){
					switch ($impuestos[$i]["codigo"]) {
		              case '0001':
		                  $data["pct_alicuota_tg"]=$impuestos[$i]["valor"];
		                  break;
		              case '0002':
		                  $data["pct_alicuota_tr"]=$impuestos[$i]["valor"];
		                  break;
		              case '0003':
		                  $data["pct_alicuota_ta"]=$impuestos[$i]["valor"];
		                  break;		                  		                  
		           	}
	           	}
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
					"id_cliente"=>$head["id_cliente"],
					"id_tipo_documento"=>$head["id_tipo_documento"],
					"nro_control_documento"=>$head["nro_control_documento"],
					"nro_documento"=>$head["nro_documento"],
					"fecha_documento"=>$head["fecha_documento"],
					"nro_factura_afectada"=>$head["nro_factura_afectada"],
					"id_doc_origen"=>'00000000000000000000000000000000',
					"id_cotizacion"=>$head["id_cotizacion"],
					"monto_exento"=>$head["monto_exento"],
					"base_imponible_tg"=>$head["base_imponible_tg"],
					"pct_alicuota_tg"=>$head["pct_alicuota_tg"],
					"base_imponible_tr"=>$head["base_imponible_tr"],
					"pct_alicuota_tr"=>$head["pct_alicuota_tr"],
					"base_imponible_ta"=>$head["base_imponible_ta"],
					"pct_alicuota_ta"=>$head["pct_alicuota_ta"],
					"pct_descuento"=>$head["pct_descuento"],
					"pct_adicional"=>$head["pct_adicional"],
					"id_status"=>2,
					"id_estado"=>2,
					"id_usuario"=>$head["id_usuario"],
					"observacion"=>$head["observacion"],							
				);

				$lastId=$this->vnt_operaciones_m->update($data);		
				
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
					"id_destino"=>0,
					"id_cliente"=>$head["id_cliente"],
					"id_tipo_documento"=>$head["id_tipo_documento"],
					"nro_control_documento"=>$head["nro_control_documento"],
					"nro_documento"=>$head["nro_documento"],
					"fecha_documento"=>$head["fecha_documento"],
					"nro_factura_afectada"=>$head["nro_factura_afectada"],
					"id_doc_origen"=>'00000000000000000000000000000000',
					"id_cotizacion"=>$head["id_cotizacion"],
					"monto_exento"=>$head["monto_exento"],
					"base_imponible_tg"=>$head["base_imponible_tg"],
					"pct_alicuota_tg"=>$head["pct_alicuota_tg"],
					"base_imponible_tr"=>$head["base_imponible_tr"],
					"pct_alicuota_tr"=>$head["pct_alicuota_tr"],
					"base_imponible_ta"=>$head["base_imponible_ta"],
					"pct_alicuota_ta"=>$head["pct_alicuota_ta"],
					"pct_descuento"=>$head["pct_descuento"],
					"pct_adicional"=>$head["pct_adicional"],
					"id_status"=>1,
					"id_estado"=>1,
					"id_usuario"=>$head["id_usuario"],
					"observacion"=>$head["observacion"],							
				);

				//REGISTRO NUEVO
				if ($head["id"]==0){
					$ultimo=$this->vnt_operaciones_m->getLast($head["id_empresa"],$head["id_tipo_operacion"]);
					$lastnumero=$ultimo["lastnumero"]+1;
					$lastcontrol=str_pad($lastnumero, 8, '0', STR_PAD_LEFT);

					$data["numero"]=$lastnumero;
					$data["nro_control"]=$lastcontrol;

					$lastId=$this->vnt_operaciones_m->insert($data);		
				} else {
					$lastId=$this->vnt_operaciones_m->update($data);
				}
				//echo respuesta($auth_user,$lastId);
				
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

					//PROCESA PAGO
					$delPago=$this->caj_movimientos_m->delete($lastId);	
					for($i=0, $ni=count($pago); $i < $ni; $i++){			
						$dataPago=array(
							"id"=>0,
							"order_id"=>0,
							"last_update"=>0,
							"id_empresa"=>$head["id_empresa"],
							"fecha"=>fechaLocal($head["fecha"]),
							"id_tipo_operacion"=>$head["id_tipo_operacion"],
							"id_operacion"=>$lastId,
							"monto"=>$pago[$i]["monto"],
							"id_moneda"=>$pago[$i]["id_moneda"],
							"factor"=>$pago[$i]["factor"],
							"id_instrumento"=>$pago[$i]["id_instrumento"],
							"id_cuenta"=>$pago[$i]["id_cuenta"],
							"id_banco"=>$pago[$i]["id_banco"],
							"numero_operacion"=>$pago[$i]["numero_operacion"],
						);

						$lastPago=$this->caj_movimientos_m->insert($dataPago);	
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

	public function setAbono(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$pago=$this->input->post("pago");
				for($i=0, $ni=count($pago); $i < $ni; $i++){			
					$dataPago=array(
						"id"=>0,
						"order_id"=>0,
						"last_update"=>0,
						"id_empresa"=>$pago[$i]["id_empresa"],
						"fecha"=>fechaLocal($pago[$i]["fecha"]),
						"id_tipo_operacion"=>$pago[$i]["id_tipo_operacion"],
						"id_operacion"=>$pago[$i]["id_operacion"],
						"monto"=>$pago[$i]["monto"],
						"id_moneda"=>$pago[$i]["id_moneda"],
						"factor"=>$pago[$i]["factor"],
						"id_instrumento"=>$pago[$i]["id_instrumento"],
						"id_cuenta"=>$pago[$i]["id_cuenta"],
						"id_banco"=>$pago[$i]["id_banco"],
						"numero_operacion"=>$pago[$i]["numero_operacion"],
					);

					$lastPago=$this->caj_movimientos_m->insert($dataPago);	
				}
				if ($lastPago){
					echo respuesta($auth_user,$lastPago);
				}else{
					echo error_msg(500);
				}
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

					$lastId=$this->vnt_operaciones_m->update($data);
				
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
			$one=$this->vnt_operaciones_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}
