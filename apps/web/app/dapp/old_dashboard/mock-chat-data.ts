export interface MockQA {
    id: number;
    question: string;
    answer: string;
}

export const mockChat: MockQA[] = [
    {
        id: 1,
        question: "Who are the most active voters in this DAO?",
        answer: "Based on the data, the most active 'power users' are:\n\n1. **0x12GAUGE...** with 23 votes.\n2. **0xosmoke.eth...** with 15 votes.\n3. **0xWalletC3...** with 12 votes.\n\nThese members consistently participate in governance and are key to the community's decision-making."
    },
    {
        id: 2,
        question: "How is community engagement trending?",
        answer: "Overall community engagement is moderate but shows a positive trend. The most recent proposal saw a 5% increase in voter turnout compared to the previous one. While a core group is highly active, there's an opportunity to engage the long tail of less active members."
    },
    {
        id: 3,
        question: "What's the average voter turnout?",
        answer: "The average voter turnout across the last 21 proposals is 28.5%. This suggests that while there's a dedicated group of voters, a significant portion of the community is not participating in every proposal."
    },
    {
        id: 4,
        question: "Identify a potential risk.",
        answer: "A potential risk is governance concentration. The top 3 power users account for a significant portion of the total votes. Engaging a wider base of the 152 unique voters could help decentralize decision-making and make the DAO more resilient."
    }
]