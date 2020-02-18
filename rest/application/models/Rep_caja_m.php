<?php
class Rep_caja_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getInstrumentosResumen($data){        
        $query = $this->db->query("CALL reporte_caja_instrumentos_resumen(?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }    

    public function getInstrumentosDetalle($data){        
        $query = $this->db->query("CALL reporte_caja_instrumentos_detalle(?,?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }    

    public function getCuentasResumen($data){        
        $query = $this->db->query("CALL reporte_caja_cuentas_resumen(?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }

    public function getCuentasDetalle($data){        
        $query = $this->db->query("CALL reporte_caja_cuentas_detalle(?,?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    } 

    

}
?>