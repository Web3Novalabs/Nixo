declare module 'typhoon-sdk' {
  export class TyphoonSDK {
    constructor();
    generate_approve_and_deposit_calls(
      amount: bigint,
      tokenAddress: string
    ): Promise<any[]>;
    download_notes(txHash: string): Promise<any>;
    withdraw(txHash: string, recipients: string[]): Promise<any>;
  }
}
