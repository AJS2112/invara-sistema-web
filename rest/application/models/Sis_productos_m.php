<?php
class Sis_productos_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getList($idEmpresa=""){        
        $query = $this->db->query("CALL sistema_productos_SEL(?)", array('_id'=>$idEmpresa));
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;            
    }

    public function getListByEmpresa($empresa){
        $query = $this->db->query("CALL sistema_productos_SEL(?)", array('_id'=>$empresa));
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
        $query = $this->db->query("CALL sistema_productos_ONE(?)", array('id'=>$id));
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
    }

    public function insert($data){
        $procedure = $this->db->query("CALL sistema_productos_INS(?,?,?,?,?,?,?)", $data);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }

    public function update($data){
        $procedure = $this->db->query("CALL sistema_productos_UPD(?,?,?,?,?,?,?)", $data);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }    

    public function delOne($id=NULL){  
        $procedure = $this->db->query("CALL sistema_productos_DEL(?)", array('id'=>$id));
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->resultado;
        }
        return NULL;
    }


}
?>