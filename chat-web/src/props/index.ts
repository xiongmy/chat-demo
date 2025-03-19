
export interface AgentType {
    id: string,
    description: string,
    name: string
}
export interface AgentData {
    main: string,
    agents: AgentType[]
}
export interface ModeData {
    current: string,
    all_modes: Mode[]
}
export interface Mode {
    id: string,
    name: string,
    description: string,
}

export interface BubbleType {
    role?: string,
    content?: string,
    loading?: boolean
}
export interface HistoryType {
    messageId: number,
    title: string,
    bubbleList: BubbleType[]
}