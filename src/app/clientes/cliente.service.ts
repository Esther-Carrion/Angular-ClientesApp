import { Injectable } from '@angular/core';
import { formatDate,DatePipe } from '@angular/common';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable,of ,throwError} from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map,catchError,tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
private urlEndPoint:string='http://localhost:8080/api/clientes'
private httpHeaders=new HttpHeaders({'Content-Type':'application/json'})
  constructor(private http:HttpClient,private router:Router) { }

  getClientes(page:number): Observable< any>{
     //return of(CLIENTES);
     return this.http.get(this.urlEndPoint+'/page/'+page).pipe(
      tap((response:any)=>{
        // let clientes = response as Cliente[];
        console.log('ClientesService:tap 1 ');
        (response.content as Cliente[]).forEach(cliente=>{
          console.log(cliente.nombre)
        })
      }),
      map((response:any)=>{     
        // let clientes = response as Cliente[];
       (response.content as Cliente[]).map(cliente=>{
          cliente.nombre=cliente.nombre.toUpperCase();
          //let datePipe= new DatePipe('en-US');
          //cliente.createAt= datePipe.transform(cliente.createAt,'EEEE dd,MMMM yyyy')//formatDate(cliente.createAt,'dd-MM-yyy','en-US')
          return cliente;
        });
        return response;
      }),
      tap((response:any)=>{
        console.log('ClientesService:tap 2');
        (response.content as Cliente[]).forEach(cliente=>{
          console.log(cliente.nombre)
        })
      })
     )
    }

create(cliente:Cliente): Observable<any> {
  return this.http.post<any>(this.urlEndPoint,cliente,{headers:this.httpHeaders}).pipe(
   catchError(e=>{

    if(e.status==400){
      return throwError(()=>e)
    }

    console.log(e.error.mensaje)
    Swal.fire(e.error.mensaje,e.error.error,'error');
    return throwError(()=>e);
   })
  );
}

getCliente(id):Observable<Cliente>{
  return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
    catchError(e=>{
      this.router.navigate(['/clientes']);
      console.log(e.error.mensaje)
      Swal.fire('Error al editar',e.error.mensaje,'error');
      return throwError(()=>e);
    })
  );
}

update(cliente:Cliente):Observable<Cliente>{
  return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers:this.httpHeaders}).pipe(
    catchError(e=>{

      if(e.status==400){
        return throwError(()=>e)
      }
      
      console.log(e.error.mensaje)
      Swal.fire(e.error.mensaje,e.error.error,'error');
      return throwError(()=>e);
     })
  );
}

delete(id:number):Observable<Cliente>{
  return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers:this.httpHeaders}).pipe(
    catchError(e=>{
      console.log(e.error.mensaje)
      Swal.fire(e.error.mensaje,e.error.error,'error');
      return throwError(()=>e);
     })
  );
}
}
