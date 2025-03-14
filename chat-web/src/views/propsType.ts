export interface BubbleType {
    role?: string,
    content?: string,
    loading?: boolean
  }
export interface HistoryType {
    messageId: number,
    title: string,
    bubbleList:BubbleType[]
  }