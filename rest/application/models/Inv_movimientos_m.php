<?php
class Inv_movimientos_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getList($idOperacion){
        $query = $this->db->query("CALL inventario_movimientos_SEL(?)", array('id'=>$idOperacion));
        mysqli_next_result($this->db->conn_id);        
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;
    }

    public function insert($data){
        //return $data;
        /*
        $procedure = $this->db->query("CALL inventario_movimientos_INS(?,?,?,?,?,?,?,?,?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
        */
        //ASIGNA NUEVO ID
        $query = $this->db->query("CALL getUUID()");
        mysqli_next_result($this->db->conn_id);
        $lastUUID= $query->row();
        $data["id"]=$lastUUID->id;
        $data["order_id"]=$lastUUID->order_id;
        $data["last_update"]=$lastUUID->order_id;

        //LLAMA AL PROCEDIMIENTO DE INSERCION
        $procedureName="inventario_movimientos_INS(?,?,?,?,?,?,?,?,?,?,?,?)";
        $procedure = $this->db->query("CALL ".$procedureName, $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result->result!=0){
            $savedSQL=$this->sis_sync_m->saveSQL($procedureName,$data);
            return $data["id"];
        }
        return NULL;  
    }

    public function delete($idOperacion){
        $procedure = $this->db->query("CALL inventario_movimientos_DEL(?)", array('id'=>$idOperacion));
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->resultado;
        }
        return NULL;
    }
    /*
    */

}
?>