// transaction.model.ts
export interface Transaction {
    id: number;            
    userId: number;        
    amount: number;        
    date: Date;            
    category: string;      
    description?: string; 
    type: 'income' | 'expense';  
  }
  