<?php
class Sis_sync_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }
        
    public function getList(){        
        $query = $this->db
        ->select("
            hex(o.id) as id,
            o.order_id,
            o.sql_string,
            o.procedure_name,
            o.parameters
        ")
        ->from("sistema_sqls o")
        ->order_by("order_id")
        ->get();
        return $query->result_array();
    }

    public function inSync(){
        $query = $this->db->query("CALL sistema_sync_insync()");
        mysqli_next_result($this->db->conn_id);
        $result = $query->row();
        if ($result->result!=0){
            return false;
        }
        return true;  
    }

    public function doSQL($procedureName="",$data=array()){  
        $query = $this->db->query("CALL ".$procedureName, $data);
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()===1){
            return true;
        }
        return false;
    }

    public function delOne($id){
        $this->db->where("id",hex2bin($id))->delete("sistema_sqls");
        if ($this->db->affected_rows()===1){
            return TRUE;
        }
        return NULL;                
    }

    function saveSQL($procedureName="",$data=array()){
        $query = $this->db->query("CALL getUUID()");
        mysqli_next_result($this->db->conn_id);
        $lastUUID= $query->row();
        $datos=array(
            "id"=>hex2bin($lastUUID->id),
            "order_id"=>$lastUUID->order_id,            
            "sql_string"=>"algo",
            "procedure_name"=>$procedureName,
            "parameters"=>json_encode($data)
        );
        $this->db->insert("sistema_sqls",$datos);
        if ($this->db->affected_rows()===1){
            return true;
        } else {
            return NULL;
        }
    }

}
?>