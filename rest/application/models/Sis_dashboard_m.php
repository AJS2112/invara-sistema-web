<?php
class Sis_dashboard_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getList($data){       
        $query = $this->db->query("CALL reporte_dashboard_resumen(?,?,?)", $data);
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;      
    }

    public function getCaja($data){       
        $query = $this->db->query("CALL reporte_dashboard_caja(?,?,?)", $data);
        if ($query->num_rows()>0){
            return $query->result_array();
        }
        return NULL;      
    }

    public function getOne($id=NULL){  
        $query = $this->db->query("CALL sistema_listas_ONE(?)", array('id'=>$id));
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
    }

    public function insert($data){
        $procedure = $this->db->query("CALL sistema_listas_INS(?,?,?,?,?)", $data);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }

    public function update($data){
        $procedure = $this->db->query("CALL sistema_listas_UPD(?,?,?,?,?)", $data);
        $result = $procedure->row();
        if ($result){
            return $result->id;
        }
        return NULL;    
    }    

    public function delete($id){
        $procedure = $this->db->query("CALL sistema_listas_DEL(?)", array('id'=>$id));
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