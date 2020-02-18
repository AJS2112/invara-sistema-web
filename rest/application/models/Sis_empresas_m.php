<?php
class Sis_empresas_m extends CI_Model{
    public function __construct(){
        parent::__construct();
        $this->load->model("sis_sync_m");
    }

    public function getList(){        
        $query = $this->db->query("CALL sistema_empresas_SEL(?)", array('_id'=>""));
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;            
    }

    public function getListByUser($permisos){
        $query = $this->db->query("CALL sistema_empresas_SEL(?)", array('_id'=>$permisos));
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;            
        /*
        ->get_compiled_select();
        return $query;
        */
    }  
    
    public function getOne($id=NULL){  
        $query = $this->db->query("CALL sistema_empresas_ONE(?)", array('id'=>$id));
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
    }

    public function insert($data=array()){
        //ASIGNA NUEVO ID
        $query = $this->db->query("CALL getUUID()");
        mysqli_next_result($this->db->conn_id);
        $lastUUID= $query->row();
        $data["id"]=$lastUUID->id;
        $data["order_id"]=$lastUUID->order_id;
        $data["last_update"]=$lastUUID->order_id;

        //LLAMA AL PROCEDIMIENTO DE INSERCION
        $procedureName="sistema_empresas_INS(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        $procedure = $this->db->query("CALL ".$procedureName, $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result->result!=0){
            $savedSQL=$this->sis_sync_m->saveSQL($procedureName,$data);
            return $data["id"];
        }
        return NULL;  
    }

    public function update($data=array()){
        $procedureName="sistema_empresas_UPD(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        $procedure = $this->db->query("CALL ". $procedureName, $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result->result!=0){
            $savedSQL=$this->sis_sync_m->saveSQL($procedureName,$data);
            return $data["id"];
        } else {
            return $result;
        }
        return NULL;    
    }     


}
?>