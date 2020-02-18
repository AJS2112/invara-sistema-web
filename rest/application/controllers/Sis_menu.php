<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sis_menu extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("sis_menu_m");
	}


	public function getMenu(){
		function _z00_get_tree($tree, $pid="00000000000000000000000000000000",$a=array()) {
			$ax = array();
		    foreach ($tree as $row) {
		        if ($row['id_padre'] == $pid) {
		            $child = _z00_get_tree($tree, $row['id']);
				    if(count($child)) {
			            $a[] = array(
			            				'id'=>$row['id'],			            				
			            				'id_seccion'=>$row['id_seccion'],
			            				'id_padre'=>$row['id_padre'],
			            				'id_tipo'=>$row['id_tipo'],
			            				'nombre' => $row['nombre'],
			            				'descrip' => $row['descrip'],
			            				'trigger' => $row['trigger'],
			            				'orden_pos' => $row['orden_pos'],
			            				'icono' => $row['icono'],
			            				'tooltip' => $row['tooltip'],
			            				'child' => $child 
			            			);
				    } else {
			            $a[] = array(
			            				'id'=>$row['id'],			            							            	
			            				'id_seccion'=>$row['id_seccion'],
			            				'id_padre'=>$row['id_padre'],
			            				'id_tipo'=>$row['id_tipo'],
			            				'nombre' => $row['nombre'],
			            				'descrip' => $row['descrip'],
			            				'trigger' => $row['trigger'],
			            				'orden_pos' => $row['orden_pos'],
			            				'icono' => $row['icono'],
			            				'tooltip' => $row['tooltip'],
			            			);				    	
				    }

		        }
		    }

		    if(count($a) == 0) {
		        return null;
		    }
		    return $a;
		}
/*
*/

		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->sis_menu_m->getList();
			$json=_z00_get_tree($menu);
			echo respuesta($auth_user,$json);
		}	

	}


	public function getMenuByUser(){
		/*
		*/
		function _z00_get_tree($tree, $pid="00000000000000000000000000000000",$a=array()) {
			$ax = array();
		    foreach ($tree as $row) {
		        if ($row['id_padre'] == $pid) {
		            $child = _z00_get_tree($tree, $row['id']);
				    if(count($child)) {
			            $a[] = array(
			            				'id'=>$row['id'],			            				
			            				'id_seccion'=>$row['id_seccion'],
			            				'id_padre'=>$row['id_padre'],
			            				'id_tipo'=>$row['id_tipo'],
			            				'nombre' => $row['nombre'],
			            				'descrip' => $row['descrip'],
			            				'trigger' => $row['trigger'],
			            				'orden_pos' => $row['orden_pos'],
			            				'icono' => $row['icono'],
			            				'tooltip' => $row['tooltip'],
			            				'child' => $child 
			            			);
				    } else {
			            $a[] = array(
			            				'id'=>$row['id'],			            							            	
			            				'id_seccion'=>$row['id_seccion'],
			            				'id_padre'=>$row['id_padre'],
			            				'id_tipo'=>$row['id_tipo'],
			            				'nombre' => $row['nombre'],
			            				'descrip' => $row['descrip'],
			            				'trigger' => $row['trigger'],
			            				'orden_pos' => $row['orden_pos'],
			            				'icono' => $row['icono'],
			            				'tooltip' => $row['tooltip'],
			            			);				    	
				    }

		        }
		    }

		    if(count($a) == 0) {
		        return null;
		    }
		    return $a;
		}

		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$fk= implode($this->input->post());			
				$menu=$this->sis_menu_m->getListByUser($fk);
				$json=_z00_get_tree($menu);
				echo respuesta($auth_user,$json);
				//echo respuesta($auth_user,$menu);
			} else  {
				echo error_msg(400);				
			}
			/*
			*/
		}	
	}



	public function getList(){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$menu=$this->sis_menu_m->getList();
			echo respuesta($auth_user,$menu);
		}
	}	

	public function getListByUser(){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$fk= implode($this->input->post());			
				$menu=$this->sis_menu_m->getListByUser($fk);
				echo respuesta($auth_user,$menu);
			} else  {
				echo error_msg(400);				
			}
			/*
			*/
		}	
	}

	public function getOne($id){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$menu=$this->sis_menu_m->getOne($id);
			} else {
				$menu=array(
					"id"=>0,
					"id_seccion"=>1,
					"id_padre"=>0,										
					"id_tipo"=>1,					
					"nombre"=>"Nuevo item",
					"descrip"=>"",
					"trigger"=>"",
					"orden_pos"=>0,
					"icono"=>0,																				
					"tooltip"=>""
				);
			}
			echo respuesta($auth_user,$menu);
		}
	}

	public function setOne(){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($this->input->post()){
				$id=$this->input->post("id",true);
				$data=array(
					'id'=>$this->input->post("id",true),	
					'id_seccion'=>$this->input->post("id_seccion",true),
					'id_padre'=>$this->input->post("id_padre",true),
					'id_tipo'=>$this->input->post("id_tipo",true),
					'nombre'=>$this->input->post("nombre",true),
					'descrip'=>$this->input->post("descrip",true),
					'trigger'=>$this->input->post("trigger",true),
					'orden_pos'=>$this->input->post("orden_pos",true),
					'icono'=>$this->input->post("icono",true),
					'tooltip'=>$this->input->post("tooltip",true),
				);

				if ($id!=0){
					$lastId=$this->sis_menu_m->update($data);
				}else{
					$lastId=$this->sis_menu_m->insert($data);		
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
			$one=$this->sis_menu_m->delete($id);
			echo respuesta($auth_user,$one);
		}
	}	

}
