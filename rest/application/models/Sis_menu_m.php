<?php
class Sis_menu_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getList(){        
        $query = $this->db->query("CALL sistema_menu_SEL(?)", array('_id'=>""));
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;            
    }


    public function getListByUser($permisos){
        $query = $this->db->query("CALL sistema_menu_SEL(?)", array('_id'=>$permisos));
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;            
    }    


    public function getOne($id=NULL){    
        $query = $this->db->query("CALL sistema_menu_ONE(?)", array('id'=>$id));
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;    
    }

    public function insert($data){
        $procedure = $this->db->query("CALL sistema_menu_INS(?,?,?,?,?,?,?,?,?,?)", $data);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }

    public function update($data){
        $procedure = $this->db->query("CALL sistema_menu_UPD(?,?,?,?,?,?,?,?,?,?)", $data);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }    

    public function delete($id){
        $procedure = $this->db->query("CALL sistema_menu_DEL(?)", array('id'=>$id));
        $result = $procedure->row();
        if ($result){
            return $result->resultado;
        }
        return NULL;
    }
}
?>