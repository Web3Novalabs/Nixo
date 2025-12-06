import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json([
        { token: "STRK", balance: "0.00" },
        { token: "USDC", balance: "0.00" },
        { token: "USDT", balance: "0.00" },
      ]);
    }

    // Note: This endpoint now just returns a placeholder structure
    // The actual balances are fetched client-side via useTokenBalances hook
    // We'll pass them directly from the chat component instead
    return NextResponse.json([
      { token: "STRK", balance: "0.00" },
      { token: "USDC", balance: "0.00" },
      { token: "USDT", balance: "0.00" },
    ]);
  } catch (error) {
    console.error("Balance API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch balances" },
      { status: 500 }
    );
  }
}
