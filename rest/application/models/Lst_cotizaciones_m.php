<?php
class Lst_cotizaciones_m extends CI_Model{
    public function __construct(){
        parent::__construct();
        $this->load->model("sis_sync_m");
    }

    public function getList($idEmpresa){        
        $query = $this->db->query("CALL listas_cotizaciones_SEL(?)", array('id_empresa'=>$idEmpresa));
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }

    public function getListDetail($id){        
        $query = $this->db->query("CALL listas_cotizaciones_detail_SEL(?)", array('id_cotizacion'=>$id));
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }


    public function getLast($idEmpresa){
        $query = $this->db->query("CALL listas_cotizaciones_LAST(?)", array('id_empresa'=>$idEmpresa));
        return $query->result_array();
        /*
        ->get_compiled_select();
        return $query;
        */
    }

    public function getLastN($idEmpresa=NULL, $idTipo=NULL){  
        $query = $this->db->query("CALL listas_cotizaciones_LASTN(?)", array('id_empresa'=>$idEmpresa));
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
    }

    public function getOne($id=NULL){  
        $query = $this->db->query("CALL listas_cotizaciones_ONE(?)", array('id'=>$id));
        return $query->row_array();
        /*if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;*/
    }

    public function insert($data=array()){
        //ASIGNA NUEVO ID
        $query = $this->db->query("CALL getUUID()");
        mysqli_next_result($this->db->conn_id);
        $lastUUID= $query->row();
        $data["id"]=$lastUUID->id;
        $data["order_id"]=$lastUUID->order_id;
        $data["last_update"]=$lastUUID->order_id;

        //LLAMA AL PROCEDIMIENTO DE INSERCION
        $procedureName="listas_cotizaciones_INS(?,?,?,?,?,?,?,?)";
        $procedure = $this->db->query("CALL ".$procedureName, $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result->result!=0){
            $savedSQL=$this->sis_sync_m->saveSQL($procedureName,$data);
            return $data["id"];
        }
        return NULL;  
    }


    public function insertDetail($data=array()){
        //ASIGNA NUEVO ID
        $query = $this->db->query("CALL getUUID()");
        mysqli_next_result($this->db->conn_id);
        $lastUUID= $query->row();
        $data["id"]=$lastUUID->id;
        $data["order_id"]=$lastUUID->order_id;
        $data["last_update"]=$lastUUID->order_id;

        //LLAMA AL PROCEDIMIENTO DE INSERCION
        $procedureName="listas_cotizaciones_detail_INS(?,?,?,?,?,?,?)";
        $procedure = $this->db->query("CALL ".$procedureName, $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result->result!=0){
            $savedSQL=$this->sis_sync_m->saveSQL($procedureName,$data);
            return $data["id"];
        }
        return NULL;  
    }
    /*
    */

}
?>