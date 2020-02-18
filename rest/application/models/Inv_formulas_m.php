<?php
class Inv_formulas_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getList($id){
        $query = $this->db->query("CALL inventario_formulas_SEL(?)", array('id'=>$id));
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;
    }

    public function insert($data){
        $procedure = $this->db->query("CALL inventario_formulas_INS(?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }

    public function delete($id){
        $procedure = $this->db->query("CALL inventario_formulas_DEL(?)", array('id'=>$id));
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