export interface AggregateResponse {
  total_spend_galactic: number;     
  rows_affected: number;            
  less_spent_at: number;             
  big_spent_at: number;              
  less_spent_value: number;          
  big_spent_value: number;           
  average_spend_galactic: number;    
  big_spent_civ: string;             
  less_spent_civ: string;            
}

export interface HistoryEntry {
  id: string;                     
  fileName: string;               
  generatedAt: string;              
  success: boolean;              
  totalSpendGalactic: number;
  rowsAffected: number;
  lessSpentDate: string;          
  bigSpentDate: string;
  lessSpentValue: number;
  bigSpentValue: number;
  averageSpendGalactic: number;     
  bigSpentCiv: string;
  lessSpentCiv: string;
}
