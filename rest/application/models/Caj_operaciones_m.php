<?php
class Caj_operaciones_m extends CI_Model{
    public function __construct(){
        parent::__construct();
        $this->load->model("sis_sync_m");
    }

    public function getList($idEmpresa,$idTipo){        
        $query = $this->db->query("CALL caja_operaciones_SEL(?,?)", array('id_empresa'=>$idEmpresa, 'id_tipo'=>$idTipo));
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }

    public function getOne($id=NULL){  
        $query = $this->db->query("CALL caja_operaciones_ONE(?)", array('id'=>$id));
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
    }

    public function getLast($idEmpresa=NULL, $idTipo=NULL){  
        $query = $this->db->query("CALL caja_operaciones_LAST(?,?)", array('id_empresa'=>$idEmpresa, 'id_tipo'=>$idTipo));
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
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
        $procedureName="caja_operaciones_INS(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        $procedure = $this->db->query("CALL ".$procedureName, $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result->result!=0){
            $savedSQL=$this->sis_sync_m->saveSQL($procedureName,$data);
            return $data["id"];
        }
        return NULL;     
    }

    public function update($data){
        $procedureName="caja_operaciones_UPD(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
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
        //return $result;
    }    


}
?>