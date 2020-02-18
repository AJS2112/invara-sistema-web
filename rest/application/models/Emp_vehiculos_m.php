<?php
class Emp_vehiculos_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getList($idEmpresa){        
        $query = $this->db->query("CALL empresa_vehiculos_SEL(?)", array('id'=>$idEmpresa));
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }

    public function getOne($id=NULL){  
        $query = $this->db->query("CALL empresa_vehiculos_ONE(?)", array('id'=>$id));
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
    }

    public function insert($data){
        $procedure = $this->db->query("CALL empresa_vehiculos_INS(?,?,?,?,?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }

    public function update($data){
        $procedure = $this->db->query("CALL empresa_vehiculos_UPD(?,?,?,?,?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }    

    /*
    public function delete($id){
        $procedure = $this->db->query("CALL inventario_unidades_DEL(?)", array('id'=>$id));
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->resultado;
        }
        return NULL;
    }
    */

}
?>