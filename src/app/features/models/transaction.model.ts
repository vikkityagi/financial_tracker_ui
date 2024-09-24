// transaction.model.ts
export interface Transaction {
    id: number;            
    userId: number;        
    amount: number;        
    date: Date;            
    category_id: number;      
    description?: string; 
    type: 'income' | 'expense';  
  }
  