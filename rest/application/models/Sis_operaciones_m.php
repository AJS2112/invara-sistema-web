<?php
class Sis_operaciones_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getList($id=NULL){        
        if (!$id){
            $id="";
        } 
        $query = $this->db->query("CALL sistema_operaciones_SEL(?)", array('_id'=>$id));
        return $query->result_array();
    }

    public function getListByTipo($idTipo){
        $query = $this->db->query("CALL sistema_operaciones_SEL(?)", array('_id'=>$idTipo));
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
        $query = $this->db->query("CALL sistema_operaciones_ONE(?)", array('id'=>$id));
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
    }

    public function insert($data){
        $procedure = $this->db->query("CALL sistema_operaciones_INS(?,?,?,?,?,?,?,?,?,?,?,?)", $data);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }

    public function update($data){
        $procedure = $this->db->query("CALL sistema_operaciones_UPD(?,?,?,?,?,?,?,?,?,?,?,?)", $data);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }    

    public function delete($id){
        $procedure = $this->db->query("CALL sistema_operaciones_DEL(?)", array('id'=>$id));
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