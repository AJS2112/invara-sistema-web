<?php
class Sis_login_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function login($logname,$password){        
        $query=$this->db->select("
            hex(u.id) as id,
            u.order_id,
            hex(u.id_empresa) as id_empresa,
            u.id_tipo,
            u.nombre,
            u.cedula,
            u.logname,
            u.permisos,
            e.nombre as empresa_nombre
            ")
        ->from("sistema_usuarios u")
        ->join("sistema_empresas as e","u.id_empresa = e.id","left")
        ->where("logname",$logname)
        ->where("pass",$password)
        ->get();
        if ($query->num_rows()===1){
            return $query->row();
        }
        return false;
    }

    public function checkUser($id,$logname){
        $query=$this->db->
        limit(1)->
        get_where("sistema_usuarios",array("hex(id)"=>$id,"logname"=>$logname));
        return $query->num_rows()===1;
    }
}
?>