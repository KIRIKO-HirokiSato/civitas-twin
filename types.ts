
export interface ConfidenceBreakdown {
  dataDensity: number;      
  contextAlignment: number;  
  predictionVariance: string; 
}

export interface SimulationResult {
  rawText: string;
  groundingUrls?: { title: string; uri: string }[];
  snapshotId: string;
}

export interface SimulationParams {
  newsText: string;
  purpose: string;
  region: string;
  today: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  date: string;
  newsText: string;
  purpose: string;
  region: string;
  result: SimulationResult;
}
