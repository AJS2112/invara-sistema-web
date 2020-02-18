<?php
class Sis_unidades_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getList(){        
        $query = $this->db->query("CALL sistema_unidades_SEL()");
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;            
    }

    public function getOne($id=NULL){  
        $query = $this->db->query("CALL sistema_unidades_ONE(?)", array('id'=>$id));
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
    }

    public function insert($data){
        $procedure = $this->db->query("CALL sistema_unidades_INS(?,?,?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }

    public function update($data){
        $procedure = $this->db->query("CALL sistema_unidades_UPD(?,?,?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }    

    public function delete($id){
        $procedure = $this->db->query("CALL sistema_unidades_DEL(?)", array('id'=>$id));
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