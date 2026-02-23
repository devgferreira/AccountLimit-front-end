import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ApiResult,
  LimitManagementCreateDTO,
  LimitManagementDTO,
  LimitManagementRequest,
  LimitManagementUpdateDTO,
  TransactionAuthorizationDTO
} from '../models/accountlimit.models';

@Injectable({ providedIn: 'root' })
export class AccountLimitApiService {
  private base = environment.accountLimitApiBaseUrl;

  constructor(private http: HttpClient) {}

  // LimitManagement
  createLimit(payload: LimitManagementCreateDTO) {
    return this.http.post<ApiResult>(`${this.base}/api/LimitManagement`, payload);
  }

  getLimits(query: LimitManagementRequest) {
    let params = new HttpParams().set('cpf', query.cpf);
    if (query.agency) params = params.set('agency', query.agency);

    return this.http.get<ApiResult<LimitManagementDTO[]>>(`${this.base}/api/LimitManagement`, { params });
  }

  updateLimit(cpf: string, agency: string, payload: LimitManagementUpdateDTO) {
    const params = new HttpParams().set('cpf', cpf).set('agency', agency);
    return this.http.put<ApiResult>(`${this.base}/api/LimitManagement`, payload, { params });
  }

  deleteLimit(cpf: string, agency: string) {
    const params = new HttpParams().set('cpf', cpf).set('agency', agency);
    return this.http.delete<ApiResult>(`${this.base}/api/LimitManagement`, { params });
  }

  // TransactionAuthorization
  authorizeTransaction(payload: TransactionAuthorizationDTO) {
    return this.http.post<ApiResult>(`${this.base}/api/TransactionAuthorization`, payload);
  }
}