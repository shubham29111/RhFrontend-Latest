import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({providedIn: "root"})

export class BookedService {
    constructor(private roomApi: HttpClient) {}


    baseBookedUrl: string = "https://hotelbooking.stepprojects.ge/api/Booking"


    getRooms(): Observable<any> {
       return this.roomApi.get(this.baseBookedUrl)
    }

    postRoom(data:any): Observable<any>{
        return this.roomApi.post(this.baseBookedUrl, data)
    }

    deleteRoom(id: any): Observable<any> {
        return this.roomApi.delete(this.baseBookedUrl + "/" + id, {responseType: "text"})
    }
}