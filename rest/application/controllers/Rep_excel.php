<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Rep_excel extends CI_Controller {

 public function __construct(){
  
  parent::__construct();
        $this->load->library('excel');
    }
    
    public function exportarExcel(){
      /*
  */
      $this->load->helper('authjwt_helper');
      $auth_user=autoriza();
      if (!$auth_user){
        echo error_msg(401);
      } else {

        if ($this->input->post()){
          $this->load->model("list_agentes_m");
          $this->load->model("comp_iva_m");
          $this->load->model("compras_m");

          $idAgente=$this->input->post("idAgente",true);
          $anio=$this->input->post("anio",true);
          $mes=str_pad($this->input->post("mes",true), 2, '0', STR_PAD_LEFT);
          $agente= $this->list_agentes_m->getOne($idAgente);

          switch ($mes) {
              case '01':
                  $txtmes='Enero';
                  break;
              case '02':
                  $txtmes='Febrero';
                  break;
              case '03':
                  $txtmes='Marzo';
                  break;
              case '04':
                  $txtmes='Abril';
                  break;
              case '05':
                  $txtmes='Mayo';
                  break;
              case '06':
                  $txtmes='Junio';
                  break;                  
              case '07':
                  $txtmes='Julio';
                  break;
              case '08':
                  $txtmes='Agosto';
                  break;
              case '09':
                  $txtmes='Septiembre';
                  break;
              case '10':
                  $txtmes='Octubre';
                  break;
              case '11':
                  $txtmes='Noviembre';
                  break;
              case '12':
                  $txtmes='Diciembre';
                  break;                                    
          }

          $inicio=$this->input->post("anio",true)."/".$this->input->post("mes",true)."/01";
          $fin=$this->input->post("anio",true)."/".$this->input->post("mes",true)."/31";

          $myDesde=date_format(date_create($inicio), "Y/m/d");
          $myHasta=date_format(date_create($fin), "Y/m/d");

          $desde = (string)$myDesde;
          $hasta = (string)$myHasta;

          $desde = "'".$desde."'";
          $hasta = "'".$hasta."'";

          $datos=array(
            'idAgente'=>$idAgente,
            'desde'=>$desde,
            'hasta'=>$hasta,
          );      

          if ($idAgente!=0){

            $objPHPexcel = PHPExcel_IOFactory::load('./files/xls/librocomprascontribuyente.xls');

            $objWorksheet = $objPHPexcel->getActiveSheet();
            $objWorksheet->getCell('D1')->setValue($agente["nombre"].' - '.$agente["rif"]);
            $objWorksheet->getCell('D3')->setValue($txtmes.' - '.$anio);

            //$lista=$this->comp_iva_m->getLibroCompra($datos);
            $lista=$this->compras_m->getLibroCompras($datos);
            for($i=0, $ni=count($lista); $i < $ni; $i++){

              //FECHA DOCUMENTO
              $time = strtotime($lista[$i]["fecha_emision"]);
              $newformat = date('d/m/Y',$time);
              //FECHA COMPROBANTE
              $comprobante_fecha ='';
              if ($lista[$i]["comprobante_fecha"]){
                $time = strtotime($lista[$i]["comprobante_fecha"]);
                $comprobante_fecha = date('d/m/Y',$time);
              }
              //TIPO DOCUMENTO
              $nro_documento="";
              $nro_notadebito="";
              $nro_notacredito="";

              if ($lista[$i]["doc_idtipodocumento"]=='12') $nro_documento=$lista[$i]["doc_nrodocumento"];
              if ($lista[$i]["doc_idtipodocumento"]=='13') $nro_notadebito=$lista[$i]["doc_nrodocumento"];
              if ($lista[$i]["doc_idtipodocumento"]=='14') $nro_notacredito=$lista[$i]["doc_nrodocumento"];


              $fila=10+$i;

              
              $objWorksheet->insertNewRowBefore($fila, 1);

              $objWorksheet->getCell('A'.$fila)->setValue($i+1);
              $objWorksheet->getCell('B'.$fila)->setValue($newformat);
              $objWorksheet->getCell('C'.$fila)->setValue($lista[$i]["beneficiario_rif"]);
              $objWorksheet->getCell('D'.$fila)->setValue($lista[$i]["beneficiario_nombre"]);
              
              $objWorksheet->getCell('F'.$fila)->setValue($lista[$i]["comprobante_numero"]);
              $objWorksheet->getCell('G'.$fila)->setValue($comprobante_fecha);

              $objWorksheet->getCell('L'.$fila)->setValue($nro_documento);
              $objWorksheet->getCell('M'.$fila)->setValue($lista[$i]["doc_nrocontrol"]);
              $objWorksheet->getCell('N'.$fila)->setValue($nro_notadebito);
              $objWorksheet->getCell('O'.$fila)->setValue($nro_notacredito);

              $objWorksheet->getCell('P'.$fila)->setValue('01 Registro');
              $objWorksheet->getCell('Q'.$fila)->setValue($lista[$i]["doc_nrofacturaafectada"]);

              $objWorksheet->getCell('R'.$fila)->setValue(0.0);
              $objWorksheet->getCell('S'.$fila)->setValue(0.0);
              $objWorksheet->getCell('W'.$fila)->setValue($lista[$i]["doc_totalcompras"]);
              $objWorksheet->getCell('X'.$fila)->setValue(0.0);
              $objWorksheet->getCell('Y'.$fila)->setValue($lista[$i]["doc_sincredito"]);
              $objWorksheet->getCell('Z'.$fila)->setValue(0.0);
              $objWorksheet->getCell('AA'.$fila)->setValue(0.0);
              $objWorksheet->getCell('AB'.$fila)->setValue($lista[$i]["doc_baseimponible"]);
              $objWorksheet->getCell('AC'.$fila)->setValue($lista[$i]["pct_alicuota"]);
              $objWorksheet->getCell('AD'.$fila)->setValue($lista[$i]["doc_montoiva"]);
              $objWorksheet->getCell('AE'.$fila)->setValue($lista[$i]["doc_montoretenido"]);
              $objWorksheet->getRowDimension($fila)->setRowHeight(16);

            }


          }

          $filename= $mes."-".$anio." ".$agente["rif"]." COMPRAS.xlsx"; //save our workbook as this file name
          $route = ("./files/xls/".$filename);

          $objWriter = PHPExcel_IOFactory::createWriter($objPHPexcel, 'Excel2007');
          $objWriter->save($route);
          echo respuesta($auth_user,$filename);
        }


      }
          //$objWriter = PHPExcel_IOFactory::createWriter($objPHPexcel, 'Excel5');


          /*          
          $this->excel->setActiveSheetIndex(0);
          //name the worksheet
          $this->excel->getActiveSheet()->setTitle('Informe');
          //set cell A1 content with some text
          $this->excel->getActiveSheet()->setCellValue('A1','Celda1');
          $this->excel->getActiveSheet()->getStyle('A1')->getFont()->setBold(true);
          $this->excel->getActiveSheet()->getStyle('A1')->getFont()->setSize(10);
          
          //header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          //header('Content-Disposition: attachment;filename="'.$filename.'"'); //tell browser what's the file name
          //header('Cache-Control: max-age=0'); //no cache
  
          //$datos=$this->comp_iva_m->getListDeclaracion($idAgente);


           // redireccionamos la salida al navegador del cliente (Excel2007)
          */


    }
    
}