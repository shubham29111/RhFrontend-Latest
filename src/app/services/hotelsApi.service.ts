import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({providedIn: "root"})

export class HotelsService {
    constructor(private roomApi: HttpClient) {}


    baseHotelsUrl: string = "https://hotelbooking.stepprojects.ge/api/Hotels/"


    getHotels(): Observable<any> {
       return this.roomApi.get(this.baseHotelsUrl + "GetAll")
    }
}