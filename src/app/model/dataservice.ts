import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "http://localhost:8080/api/v1/meetings";

  constructor(private httpClient: HttpClient) { }


  public sendGetRequest(){
    return this.httpClient.get(this.REST_API_SERVER).toPromise();
  }

  

  public sendPostRequest(data) {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    //let options = new RequestOptions({ headers: headers });
    return this.httpClient.post(this.REST_API_SERVER, data).subscribe(data => {
      console.log(data);
    });
  }

  public sendPutRequest(id, data) {
    return this.httpClient.put(this.REST_API_SERVER + '/' + id, data).subscribe(data => {
      console.log(data);
    });
  }


  public sendDeleteRequest(id) {
      return this.httpClient.delete(this.REST_API_SERVER + '/' + id).subscribe(data => {
        console.log(data);
    });
  }


}