<?php
class Inv_atributos_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getList($id){
        $query = $this->db->query("CALL inventario_atributos_SEL(?)", array('id'=>$id));
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;
    }

    public function getOne($id=NULL){  
        $query = $this->db->query("CALL inventario_atributos_ONE(?)", array('id'=>$id));
                if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;
    }

    public function insert($data){
        $procedure = $this->db->query("CALL inventario_atributos_INS(?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }

    public function update($data){
        $procedure = $this->db->query("CALL inventario_atributos_UPD(?,?,?,?)", $data);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }    

    public function delete($id){
        $procedure = $this->db->query("CALL inventario_atributos_DEL(?)", array('id'=>$id));
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