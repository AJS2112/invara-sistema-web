<?php
class Rep_ventas_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getOperacionesResumen($data){        
        $query = $this->db->query("CALL reportes_ventas_operaciones_resumen(?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }    

    public function getOperacionesDetalle($data){        
        $query = $this->db->query("CALL reportes_ventas_operaciones_detalle(?,?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }    

    public function getClientesResumen($data){        
        $query = $this->db->query("CALL reportes_ventas_clientes_resumen(?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }

    public function getClientesDetalle($data){        
        $query = $this->db->query("CALL reportes_ventas_clientes_detalle(?,?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    } 

    public function getDeudasResumen($data){        
        $query = $this->db->query("CALL reportes_ventas_deudas_resumen(?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }

    public function getDeudasDetalle($data){        
        $query = $this->db->query("CALL reportes_ventas_deudas_detalle(?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    } 

    public function getPagosDetalle($data){        
        $query = $this->db->query("CALL reportes_ventas_pagos_detalle(?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    } 

    public function getComisionesResumen($data){        
        $query = $this->db->query("CALL reportes_ventas_comisiones_resumen(?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }

    public function getUsuariosDetalle($data){        
        $query = $this->db->query("CALL reportes_ventas_usuarios_detalle(?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    } 


}
?>