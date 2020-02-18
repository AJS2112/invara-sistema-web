<?php
class Sis_listas_m extends CI_Model{
    public function __construct(){
        parent::__construct();
        $this->load->model("sis_sync_m");
    }


    public function getByCampo($campo=NULL){       
        $query = $this->db->query("CALL sistema_listas_SELBYCAMPO(?)", array('campo'=>$campo));
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }
    /*
    public function getById($id){        
        $query = $this->db
        ->select("l.*")
        ->from("sistema_listas l")
        ->where('id',$id)
        ->order_by('nombre')
        ->get();
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;            
    }

    public function getByPadre($idPadre){        
        $query = $this->db
        ->select("l.*")
        ->from("sistema_listas l")
        ->where('id_padre',$idPadre)
        ->order_by('nombre')
        ->get();
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;            
    }
    */
    public function getCampos(){        
        $query = $this->db
        ->select("l.campo")
        ->from("sistema_listas l")
        ->group_by('campo')
        ->get();
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;         
    }    
     /*
    public function getList($campo=NULL){       
        $query = $this->db->query("CALL sistema_listas_SEL(?)", array('campo'=>$campo));
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;      
    }
    */

    public function getList($ids=NULL){
        if(!$ids) $ids="";
        $query = $this->db->query("CALL sistema_listas_SEL(?)", array('ids'=>$ids));
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
        //return $ids;
    }

    public function getOne($id=NULL){  
        $query = $this->db->query("CALL sistema_listas_ONE(?)", array('id'=>$id));
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
    }

    public function insert($data){
        $query = $this->db->query("CALL getUUID()");
        mysqli_next_result($this->db->conn_id);
        $lastUUID= $query->row();
        $data["id"]=$lastUUID->id;
        $data["order_id"]=$lastUUID->order_id;
        $data["last_update"]=$lastUUID->order_id;

        //LLAMA AL PROCEDIMIENTO DE INSERCION
        $procedureName="sistema_listas_INS(?,?,?,?,?,?,?)";
        $procedure = $this->db->query("CALL ".$procedureName, $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result->result!=0){
            $savedSQL=$this->sis_sync_m->saveSQL($procedureName,$data);
            return $data["id"];
        }
        return NULL;  
    }

    public function update($data){
        $procedureName="sistema_listas_UPD(?,?,?,?,?,?,?)";
        $procedure = $this->db->query("CALL ". $procedureName, $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result->result!=0){
            $savedSQL=$this->sis_sync_m->saveSQL($procedureName,$data);
            return $data["id"];
        } else {
            return $result;
        }
        return NULL;    
    }    

    public function delete($id){
        $procedure = $this->db->query("CALL sistema_listas_DEL(?)", array('id'=>$id));
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result){
            return $result->resultado;
        }
        return NULL;
    }

}
?>