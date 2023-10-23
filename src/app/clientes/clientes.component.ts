import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes:Cliente[];
  constructor(private clientesService:ClienteService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
 
    this.activatedRoute.paramMap.subscribe( params =>{
      let page:number=+params.get('page');

      if(!page){
        page=0;
      }
    
    this.clientesService.getClientes(page).pipe(
     tap(response=>{
         console.log("clientesComponent: tap 3");
        (response.content as Cliente[]).forEach( clientes=>{
          console.log(clientes.nombre)
        });
      })
    ).subscribe(//observador
     response=>this.clientes=response.content as Cliente[]//funcion anonima
   )
   ///tambien puede estar asi y seria lo mismo
    // tap(clientes=>this.clientes=clientes)).subscribe();
  });
  }

  delete(cliente:Cliente):void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Esta Seguro?',
      text: `¿Seguro que dese eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientesService.delete(cliente.id).subscribe(
          response=>{
            this.clientes=this.clientes.filter(cli=>cli!==cliente)
            swalWithBootstrapButtons.fire(
              'Clientes Eliminado!',
              `Cliente ${cliente.nombre} ${cliente.apellido} eliminado con exito`,
              'success'
            )
          }
        )       
      } 
    })
  }
}
