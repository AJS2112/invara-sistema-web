<?php
class Inv_productos_m extends CI_Model{
    public function __construct(){
        parent::__construct();
        $this->load->model("sis_sync_m");
    }

    public function getList($idEmpresa){     
        $query = $this->db->query("CALL inventario_productos_SEL(?)", array('id_empresa'=>$idEmpresa));
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }

    public function getListWeb($idEmpresa){     
        $query = $this->db->query("CALL inventario_productos_web_SEL(?)", array('id_empresa'=>$idEmpresa));
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }

    public function getOne($idEmpresa, $id=NULL){  
        $query = $this->db->query("CALL inventario_productos_ONE(?,?)", array('id_empresa'=>$idEmpresa, 'id'=>$id));
        mysqli_next_result($this->db->conn_id);
        if ($query->num_rows()===1){
            return $query->row_array();
        }
        return NULL;
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
        $procedureName="inventario_productos_INS(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        $procedure = $this->db->query("CALL ".$procedureName, $data);
        mysqli_next_result($this->db->conn_id);
        $result = $procedure->row();
        if ($result->result!=0){
            $savedSQL=$this->sis_sync_m->saveSQL($procedureName,$data);
            return $data["id"];
        }
        return NULL;  
    }

    public function update($data=array()){
        $procedureName="inventario_productos_UPD(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
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

    public function existencia($data=array()){
        $procedureName="inventario_productos_EXIST(?,?,?)";
        $procedure = $this->db->query("CALL ". $procedureName, $data);
        mysqli_next_result($this->db->conn_id);
        /*$result = $procedure->row();
        if ($result->result!=0){
            $savedSQL=$this->sis_sync_m->saveSQL($procedureName,$data);
            return $data["id"];
        } else {
            return $result;
        }
        return NULL;    */
    }    


}
?>