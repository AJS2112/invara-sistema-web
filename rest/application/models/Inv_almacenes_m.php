<?php
class Inv_almacenes_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getList($idEmpresa){        
        $query = $this->db->query("CALL inventario_almacenes_SEL(?)", array('id_empresa'=>$idEmpresa));
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;            
    }

    public function getOne($id=NULL){  
        $query = $this->db->query("CALL inventario_almacenes_ONE(?)", array('id'=>$id));
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
    }

    public function getDefault($idEmpresa){  
        $query = $this->db->query("CALL inventario_almacenes_DEFAULT(?)", array('id_empresa'=>$idEmpresa));
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
    }

    public function insert($data){
        $procedure = $this->db->query("CALL inventario_almacenes_INS(?,?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }

    public function update($data){
        $procedure = $this->db->query("CALL inventario_almacenes_UPD(?,?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }    

    public function delete($id){
        $procedure = $this->db->query("CALL inventario_almacenes_DEL(?)", array('id'=>$id));
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