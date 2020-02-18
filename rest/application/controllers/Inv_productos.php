<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inv_productos extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("inv_productos_m");
	}

	public function getList($idEmpresa=NULL){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->inv_productos_m->getList($idEmpresa);
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getListWeb($idEmpresa=NULL){
		$datos=$this->inv_productos_m->getListWeb($idEmpresa);
		echo json_encode($datos);
	}	

	public function getOne($idEmpresa,$id=NULL){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->inv_productos_m->getOne($idEmpresa, $id);
			} else {
				$data=array(
					"id"=>0,
					"order_id"=>0,
					"last_update"=>0,
					"id_empresa"=>$idEmpresa,
					"id_categoria"=>"",
					"codigo"=>"",
					"nombre"=>"Nuevo",
					"id_unidad"=>"",
					"cantidad_empaque"=>1,
					"id_impuesto"=>"11E7E1D6570F9A40AC8A00E04C6F7E24",
					"costo"=>0,
					"pct_util"=>30,
					"precio"=>0,
					"existencia"=>0,
					"imagen"=>"imagen_no_disponible.gif",
					"nombre_web"=>"",
					"descripcion_web"=>"",
					"es_visible_web"=>0,
				);
			}

			echo respuesta($auth_user,$data);
		}
		//echo "empresa: ".$idEmpresa." id: ".$id;

	}


	public function setOne(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				
				/* Getting file name */
				$filename = $_FILES['image']['name'];

				
				$id=$this->input->post("id",true);
				$data=array(
					'id'=>$this->input->post("id",true),	
					'order_id'=>$this->input->post("order_id",true),
					'last_update'=>$this->input->post("last_update",true),
					'id_empresa'=>$this->input->post("id_empresa",true),
					'id_categoria'=>$this->input->post("id_categoria",true),
					'codigo'=>$this->input->post("codigo",true),
					'nombre'=>$this->input->post("nombre",true),
					'id_unidad'=>$this->input->post("id_unidad",true),
					'cantidad_empaque'=>$this->input->post("cantidad_empaque",true),
					'id_impuesto'=>$this->input->post("id_impuesto",true),
					'costo'=>$this->input->post("costo",true),
					'precio'=>$this->input->post("precio",true),
					'existencia'=>$this->input->post("existencia",true),
					'image'=>$filename,
					'nombre_web'=>$this->input->post("nombre_web",true),
					'descripcion_web'=>$this->input->post("descripcion_web",true),
					'es_visible_web'=>$this->input->post("es_visible_web",true),
				);
				

				//echo respuesta($auth_user,$data);
				
				if ($id!=0){
					$lastId=$this->inv_productos_m->update($data);
				}else{
					$lastId=$this->inv_productos_m->insert($data);		
				}
				//echo respuesta($auth_user,$lastId);

				if ($lastId){
					/* Upload file */
					move_uploaded_file($_FILES['image']['tmp_name'], './../uploads/'.$filename);

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
			$one=$this->inv_productos_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}
