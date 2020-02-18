<?php
class Caj_movimientos_m extends CI_Model{
    public function __construct(){
        parent::__construct();
        $this->load->model("sis_sync_m");
    }

    public function getList($id=NULL){
        $query = $this->db->query("CALL caja_movimientos_SEL(?)", array('id'=>$id));
        mysqli_next_result($this->db->conn_id);        
        return $query->result_array();
    }

    public function getOne($id=NULL){
        $query = $this->db->query("CALL caja_movimientos_ONE(?)", array('id'=>$id));
        mysqli_next_result($this->db->conn_id);        
        return $query->result_array();
    }

    public function insert($data){
        //ASIGNA NUEVO ID
        $query = $this->db->query("CALL getUUID()");
        mysqli_next_result($this->db->conn_id);
        $lastUUID= $query->row();
        $data["id"]=$lastUUID->id;
        $data["order_id"]=$lastUUID->order_id;
        $data["last_update"]=$lastUUID->order_id;

        //LLAMA AL PROCEDIMIENTO DE INSERCION
        $procedureName="caja_movimientos_INS(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        $procedure = $this->db->query("CALL ".$procedureName, $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result->result!=0){
            $savedSQL=$this->sis_sync_m->saveSQL($procedureName,$data);
            return $data["id"];
        }
        return NULL;     
    }

    public function delete($id){
        $procedure = $this->db->query("CALL caja_movimientos_DEL(?)", array('id'=>$id));
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