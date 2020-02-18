<?php
class Rep_inventarios_m extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function getList($idEmpresa=NULL,$idCategoria=NULL){        
        if ($idEmpresa=='undefined'){
            $idEmpresa="";
        } 
        if ($idCategoria=='undefined' ){
            $idCategoria="";
        } 

        $query = $this->db->query("CALL reporte_inventario_productos_seleccion(?,?)", array('_id_empresa'=>$idEmpresa, '_id_categoria'=>$idCategoria));
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }

    
    public function getMovimientosResumen($data){        
        $query = $this->db->query("CALL reporte_inventario_movimientos_resumen(?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }    

    public function getMovimientosDetalle($data){        
        $query = $this->db->query("CALL reporte_inventario_movimientos_detalle(?,?,?,?)", $data);
        mysqli_next_result($this->db->conn_id);
        return $query->result_array();
    }    



}
?>