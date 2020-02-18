<?php
class Rep_compras_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getOperacionesResumen($data){        
        $query = $this->db->query("CALL reportes_compras_operaciones_resumen(?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }    

    public function getOperacionesDetalle($data){        
        $query = $this->db->query("CALL reportes_compras_operaciones_detalle(?,?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }    

    public function getProveedoresResumen($data){        
        $query = $this->db->query("CALL reportes_compras_proveedores_resumen(?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }

    public function getProveedoresDetalle($data){        
        $query = $this->db->query("CALL reportes_compras_proveedores_detalle(?,?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    } 


}
?>