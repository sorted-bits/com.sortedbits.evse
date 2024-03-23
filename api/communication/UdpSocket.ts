export class UdpSocket {
    private static instance: UdpSocket;

    private ipAddress: string;
    private port: number;

    public serialNo: string;
    public lastCommunicationTime: Date;

    private constructor() { }

    public static getInstance(): UdpSocket {
        if (!UdpSocket.instance) {
            UdpSocket.instance = new UdpSocket();
        }
        return UdpSocket.instance;
    }

    public setConnected(ipAddress: string, port: number): void {
        this.ipAddress = ipAddress;
        this.port = port;
    }
}