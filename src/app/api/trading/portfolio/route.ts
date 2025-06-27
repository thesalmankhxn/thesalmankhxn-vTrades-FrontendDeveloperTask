import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock portfolio data interface
 */
interface PortfolioItem {
    symbol: string;
    name: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    totalValue: number;
    pnl: number;
    pnlPercentage: number;
}

/**
 * Mock portfolio data
 */
const mockPortfolio: PortfolioItem[] = [
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 10,
        avgPrice: 150.0,
        currentPrice: 175.5,
        totalValue: 1755.0,
        pnl: 255.0,
        pnlPercentage: 17.0
    },
    {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        quantity: 5,
        avgPrice: 2800.0,
        currentPrice: 2950.0,
        totalValue: 14750.0,
        pnl: 750.0,
        pnlPercentage: 5.36
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        quantity: 8,
        avgPrice: 320.0,
        currentPrice: 340.0,
        totalValue: 2720.0,
        pnl: 160.0,
        pnlPercentage: 6.25
    },
    {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        quantity: 15,
        avgPrice: 200.0,
        currentPrice: 180.0,
        totalValue: 2700.0,
        pnl: -300.0,
        pnlPercentage: -10.0
    }
];

/**
 * GET handler for portfolio data
 * Returns mock portfolio data with error handling
 */
export async function GET(request: NextRequest) {
    try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simulate random error (5% chance)
        if (Math.random() < 0.05) {
            throw new Error('Simulated API error');
        }

        const totalValue = mockPortfolio.reduce((sum, item) => sum + item.totalValue, 0);
        const totalPnl = mockPortfolio.reduce((sum, item) => sum + item.pnl, 0);
        const totalPnlPercentage = (totalPnl / (totalValue - totalPnl)) * 100;

        return NextResponse.json({
            success: true,
            data: {
                portfolio: mockPortfolio,
                summary: {
                    totalValue,
                    totalPnl,
                    totalPnlPercentage: totalPnlPercentage.toFixed(2),
                    totalItems: mockPortfolio.length
                }
            }
        });
    } catch (error) {
        console.error('Portfolio API Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch portfolio data',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
