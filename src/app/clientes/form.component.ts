import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router,ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  public cliente: Cliente= new Cliente();
  public titulo:string="Crear Cliente"
  public errores:string[];
  
  constructor(private clienteService:ClienteService,
              private router:Router,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  cargarCliente():void{
    this.activatedRoute.params.subscribe(
      params=>{
        let id =params['id']
        if(id){
          this.clienteService.getCliente(id).subscribe(
            (cliente)=> this.cliente=cliente)
        }
      }
    )
  }

  update():void{
    this.clienteService.update(this.cliente)
    .subscribe({
      next:
      (response:any)=>{
        this.router.navigate(['/clientes'])
        Swal.fire('Cliente Actualizado',`Cliente ${response.cliente.nombre} editado con exito!`,'success')
      },
      error:
      err=>{
        this.errores=err.error.errors as string[];
        console.log('Codigo del error desde el backend: '+err.status);
        console.log(err.error.errors);
      }
  })
  }

  public create():void{
 
    this.clienteService.create(this.cliente)
    .subscribe({
      next:
      response=>{
      this.router.navigate(['/clientes'])
      Swal.fire('Nuevo Cliente',`Cliente ${response.cliente.nombre} creado con exito!`,'success')
    },
    error:
    err=>{
      this.errores=err.error.errors as string[];
      console.log('Codigo del error desde el backend: '+err.status);
      console.log(err.error.errors);
    }
  });
  }
}
