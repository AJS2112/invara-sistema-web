<?php
class Sis_usuarios_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function checkOne($logname){
        if (!is_null($logname)){
            $query = $this->db
            ->select("u.*")
            ->from("sistema_usuarios u")
            ->where("logname",$logname)
            ->get();
            return $query->num_rows();
        } 
    }  

    public function getList($idTipo){
        if ($idTipo!=1){
            $valor=1;
        } else {
            $valor="";
        }

        $query = $this->db->query("CALL sistema_usuarios_SEL(?)", array('_id'=>$valor));
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;        
    }


    public function getOne($id=NULL){        
        $query = $this->db->query("CALL sistema_usuarios_ONE(?)", array('id'=>$id));
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
    }

    public function insert($data){
        $procedure = $this->db->query("CALL sistema_usuarios_INS(?,?,?,?,?,?,?,?,?,?)", $data);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;
    }

    public function update($data){
        $procedure = $this->db->query("CALL sistema_usuarios_UPD(?,?,?,?,?,?,?,?,?,?)", $data);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }    

    /*
    public function delete($id){
        $this->db->where("id",$id)->delete("productos");
        if ($this->db->affected_rows()===1){
            return TRUE;
        }
        return NULL;                
    }
    */
}
?>