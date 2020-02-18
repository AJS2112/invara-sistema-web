<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sis_usuarios extends CI_Controller {
	protected $headers;

	public function __construct(){
		parent:: __construct();
		$this->load->helper('authjwt_helper');
		$this->load->model("sis_usuarios_m");
	}

	public function checkOne(){
		if ($this->input->post()){
			$logname=$this->input->post("logname",true);

			$respuesta=$this->sis_usuarios_m->checkOne($logname);
			echo $respuesta;
		} else {
			echo error_msg(400);
		}
	}

	public function getList(){
		$this->load->helper('authjwt_helper');
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			$clientes=$this->sis_usuarios_m->getList($auth_user->id_tipo);			
			echo respuesta($auth_user,$clientes);
		}
	}	

	public function getNew(){
			$usuario=array(
				"id"=>0,
				"id_empresa"=>"",
				"id_tipo"=>3,					
				"nombre"=>"Nuevo",
				"cedula"=>"",
				"tlf"=>0,
				"correo"=>"",
				"logname"=>"",					
				"pass"=>"",					
				"permisos"=>array(),
				"fecha_registro"=>date("c"),				
			);
			echo json_encode($usuario);
	}	

	public function getOne($id){
		$auth_user=autoriza();
		if (!$auth_user){
			echo error_msg(401);
		} else {
			if ($id){
				$data=$this->sis_usuarios_m->getOne($id);
			} else {
				$data=array(
					"id"=>0,
					"id_empresa"=>"",
					"id_tipo"=>3,					
					"nombre"=>"Nuevo",
					"cedula"=>"000",
					"telefono"=>0,
					"email"=>"",
					"logname"=>"",					
					"pass"=>"",					
					"permisos"=>array(),
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
				$id=$this->input->post("id",true);
				$data=array(
					'id'=>$this->input->post("id",true),
					'id_empresa'=>$this->input->post("id_empresa",true),
					'id_tipo'=>$this->input->post("id_tipo",true),					
					'nombre'=>$this->input->post("nombre",true),
					'cedula'=>$this->input->post("cedula",true),
					'telefono'=>$this->input->post("telefono",true),
					'email'=>$this->input->post("email",true),
					'logname'=>$this->input->post("logname",true),
					'pass'=>$this->input->post("pass",true),
					'permisos'=>$this->input->post("permisos",true),
				);


				if ($data["pass"]!=$this->input->post("oldpass",true)){
					$data["pass"]=sha1($data["pass"]);
				}

				if ($id!=0){
					$lastId=$this->sis_usuarios_m->update($data);
				}else{
					$lastId=$this->sis_usuarios_m->insert($data);		
				}

				if ($lastId){
					echo respuesta($auth_user,$lastId);
				}else{
					echo error_msg(500);
				}
				/*
				*/
			} else {
				echo error_msg(400);
			}
		}
	}

	public function setNew(){
		if ($this->input->post()){
			$id=$this->input->post("id",true);
			$data=array(
				'id_agente'=>$this->input->post("id_agente",true),
				'id_tipo'=>$this->input->post("id_tipo",true),					
				'nombre'=>$this->input->post("nombre",true),
				'cedula'=>$this->input->post("cedula",true),
				'tlf'=>$this->input->post("tlf",true),
				'correo'=>$this->input->post("correo",true),
				'logname'=>$this->input->post("logname",true),
				'pass'=>$this->input->post("pass",true),
				'permisos'=>$this->input->post("permisos",true),
				'empresas'=>$this->input->post("empresas",true),															
			);

			if ($data["pass"]!=$this->input->post("oldpass",true)){
				$data["pass"]=sha1($data["pass"]);
			}

			$lastId=$this->sis_usuarios_m->insert($data);		

			if ($lastId){
				echo $lastId;
			}else{
				echo FALSE;
			}
		} else {
			echo error_msg(400);
		}
	}	

}
