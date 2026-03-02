import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AiService {
    private apiUrl = environment.ORCHESTRATOR_MS;

    constructor(private http: HttpClient) { }

    trainModel(ip: string, measure: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/ai/train`, { ip, measure });
    }

    predict(ip: string, measure: string, recentValues: number[]): Observable<{ prediction: number }> {
        return this.http.post<{ prediction: number }>(`${this.apiUrl}/ai/predict`, {
            ip,
            measure,
            recent_values: recentValues
        });
    }
}
