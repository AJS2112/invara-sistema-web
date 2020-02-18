<?php
class Inv_existencias_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getList(){        
        $query = $this->db->query("CALL inventario_existencias_SEL()");
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;            
    }

    public function getOne($id=NULL){  
        $query = $this->db->query("CALL inventario_existencias_ONE(?)", array('id'=>$id));
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;
    }

    public function insert($data){
        $procedure = $this->db->query("CALL inventario_existencias_INS(?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }

    public function update($data){
        $procedure = $this->db->query("CALL inventario_existencias_UPD(?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }    


    public function aumentar($data){
        $procedure = $this->db->query("CALL inventario_existencias_AUM(?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);        
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }

    public function disminuir($data){
        $procedure = $this->db->query("CALL inventario_existencias_DIS(?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);        
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }

    public function maximoAlmacen($id=NULL){
        $query = $this->db->query("CALL inventario_existencias_MAX_ALM(?)", array('id'=>$id));
        mysqli_next_result($this->db->conn_id);        
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
    }

    /*
    public function delete($id){
        $procedure = $this->db->query("CALL inventario_almacenes_DEL(?)", array('id'=>$id));
        $result = $procedure->row();
        if ($result){
            return $result->resultado;
        }
        return NULL;
    }
    */

}
?>