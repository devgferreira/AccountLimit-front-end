export interface LimitManagementCreateDTO {
  cpf: string;
  agency: string;
  account: string;
  pixTransactionLimit: number;
}

export interface LimitManagementDTO {
  cpf: string;
  agency: string;
  account: string;
  pixTransactionLimit: number;
}

export interface LimitManagementUpdateDTO {
  pixTransactionLimit: number;
}

export interface LimitManagementRequest {
  cpf: string;
  agency?: string | null;
}

export interface TransactionAuthorizationDTO {
  transactionId?: string; // pode mandar ou deixar pro backend gerar
  payerCpf: string;
  payerAgency: string;
  payerAccount: string;
  receiverCpf: string;
  receiverAgency: string;
  receiverAccount: string;
  amount: number;
  transactionDate: string; // ISO string
}

// seu Result do back-end (ajuste se seu formato for diferente)
export interface ApiResult<T = any> {
  isSuccess: boolean;
  isFailure: boolean;
  error?: string;
  code?: string;
  value?: T;
}